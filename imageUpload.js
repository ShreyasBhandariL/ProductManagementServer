const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const stream = require("stream");

const keyFilePath = path.join(__dirname, "./apikey.json");

// Load the key file
const keyFile = require(keyFilePath);

// Configure a JWT auth client
const auth = new google.auth.JWT({
  email: keyFile.client_email,
  key: keyFile.private_key,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

// Initialize the Google Drive API client
const drive = google.drive({ version: "v3", auth });

// Configure Multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

// Function to upload file to Google Drive
const uploadFileToDrive = async (buffer, filename) => {
  try {
    const fileMetadata = {
      name: filename,
      parents: ["your-folder-id"], // replace with your folder ID
    };

    const media = {
      mimeType: "application/octet-stream",
      body: buffer,
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    return response.data.id;
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    throw error;
  }
};

// Express endpoint to handle file uploads
const express = require("express");
const app = express();

app.post("/upload", upload, async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    const fileId = await uploadFileToDrive(fileBuffer, fileName);

    res.status(200).send({ fileId });
  } catch (error) {
    res.status(500).send({ error: "Error uploading file to Google Drive" });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
