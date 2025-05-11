// services/driveService.js

import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';

// Google Drive authentication setup
const authClient = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), 'config', 'kk.json'), // Make sure this path is correct
    scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth: authClient });

/**
 * Uploads a file to Google Drive and returns a shareable link.
 * @param {Object} file - The uploaded file object from multer
 * @param {string} folderId - Optional folder ID where file should be uploaded
 * @returns {Promise<{fileId: string, webViewLink: string}>}
 */
export const uploadFileToGoogleDrive = async (file, folderId = null) => {
    try {
        const fileMetadata = {
            name: file.filename,
            parents: folderId ? [folderId] : ['1syFR2icE9Sak3H0b6Q0lrOyjc9zl3oD9'], // fallback default folder
        };

        const media = {
            mimeType: file.mimetype,
            body: fs.createReadStream(file.path),
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
        });

        const fileId = response.data.id;

        // Make file publicly accessible
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        return {
            fileId,
            webViewLink: response.data.webViewLink,
        };
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error.message);
        throw new Error('Failed to upload file to Google Drive');
    }
};

export const uploadCommunityMediaToGoogleDrive = async (files, folderId = null) => {
    try {
        const { profilePhoto, banner } = files;

        if (!profilePhoto || !banner) {
            throw new Error('Both profile photo and banner are required');
        }

        // Upload both files concurrently
        const [profilePhotoData, bannerData] = await Promise.all([
            uploadSingleFile(profilePhoto, folderId),
            uploadSingleFile(banner, folderId),
        ]);

        return {
            profilePhotoUrl: profilePhotoData.webViewLink,
            bannerUrl: bannerData.webViewLink,
        };
    } catch (error) {
        console.error('Error uploading community media:', error.message);
        throw new Error(`Failed to upload community media: ${error.message}`);
    }
};