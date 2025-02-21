const { google } = require("googleapis");
const multer = require("multer");
const stream = require("stream");
const fs = require("fs");
const path = require("path");

const keyFileContent = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

const tempKeyPath = path.join(__dirname, "temp_apikey.json");

fs.writeFileSync(tempKeyPath, keyFileContent);

// Initialize Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: tempKeyPath,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({
  version: "v3",
  auth,
});

// Configure Multer storage in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
});

/**
 * Uploads a file to Google Drive
 * @param {Buffer} fileBuffer - The buffer of the file to be uploaded
 * @param {String} fileName - The name of the file to be uploaded
 * @returns {String} - The ID of the uploaded file
 */
async function uploadFileToDrive(fileBuffer, fileName) {
  try {
    const fileMetadata = {
      name: fileName,
      parents: ["1YQGvAQczAPTcY5fx1PyKj7NJPRKhcNJo"], // Replace with your folder ID
    };

    const fileStream = new stream.PassThrough();
    fileStream.end(fileBuffer);

    const media = {
      mimeType: "application/octet-stream", // Use the correct MIME type if known
      body: fileStream,
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
}

module.exports = {
  upload,
  uploadFileToDrive,
};
