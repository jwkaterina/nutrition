const uuid = require('uuidv1');
const { put, del } = require('@vercel/blob');
const HttpError = require('../models/http-error');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const putImage = async (req, res, next) => {
    if (!req.image) {
        return next();
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return next(new HttpError('Image upload not configured.', 503));
    }

    const mimeType = req.image.mimeType;
    const ext = MIME_TYPE_MAP[mimeType];
    if (!ext) {
        return next(new HttpError(`Unsupported image type: ${mimeType}`, 415));
    }

    const pathname = `images/${uuid()}.${ext}`;
    try {
        console.log('Uploading image to Vercel Blob…');
        const blob = await put(pathname, req.image.data, {
            access: 'public',
            contentType: mimeType,
        });
        req.image.fileName = pathname;
        req.image.url = blob.url;
        console.log('Image uploaded:', blob.url, 'name:', pathname, 'type:', mimeType);
        next();
    } catch (err) {
        console.error('Blob upload failed', err);
        return next(new HttpError(err.message || 'Image upload failed.', 500));
    }
};

const deleteImage = async (fileName) => {
    if (!fileName) return;
    // Legacy Firebase images stored a bare UUID (no slash). Skip — no way to reach
    // the Firebase Storage bucket from here anymore. New Blob uploads store the
    // full pathname like "images/<uuid>.<ext>".
    if (!fileName.includes('/')) {
        console.warn(`Skipping delete of legacy Firebase image: ${fileName}`);
        return;
    }
    try {
        await del(fileName);
        console.log(`Blob image deleted: ${fileName}`);
    } catch (err) {
        // A missing/already-deleted blob is not fatal.
        console.warn(`Blob delete failed for ${fileName}:`, err.message || err);
    }
};

exports.putImage = putImage;
exports.deleteImage = deleteImage;
