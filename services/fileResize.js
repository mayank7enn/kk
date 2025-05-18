const sharp = require('sharp');

// Helper function to compress image to under 1MB
async function compressImage(buffer) {
    let quality = 85; // Start with high quality
    let compressedBuffer;
    let fileSize;

    const MAX_SIZE_BYTES = 1024 * 1024; // 1 MB

    // Resize image first
    let resizedBuffer = await sharp(buffer)
        .resize({ width: 1200, fit: 'inside' })
        .toFormat('jpeg')
        .toBuffer();

    // Try reducing quality until image is under 1MB
    while (true) {
        compressedBuffer = await sharp(resizedBuffer)
            .jpeg({ quality })
            .toBuffer();

        fileSize = compressedBuffer.length;

        if (fileSize <= MAX_SIZE_BYTES || quality <= 30) {
            break;
        }

        quality -= 5; // Reduce quality step by step
    }

    return compressedBuffer;
}