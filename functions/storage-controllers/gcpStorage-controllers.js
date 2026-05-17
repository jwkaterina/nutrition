const uuid = require('uuidv1');
const HttpError = require('../models/http-error');

let storage = null;
try {
    const { initializeApp } = require('firebase/app');
    const firebaseConfig = require('../firebase-config.json');
    const { getStorage } = require('firebase/storage');
    storage = getStorage(initializeApp(firebaseConfig));
} catch (_) {
    console.warn('Firebase config missing — image upload disabled.');
}

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const putImage = async (req, res, next) => {

    if(!req.image) {
        return next();
    }

    if (!storage) {
        return next(new HttpError('Image upload not configured.', 503));
    }

    const mimeType = req.image.mimeType;
    const ext = MIME_TYPE_MAP[mimeType];
    const fileName = uuid() + '.' + ext;

    const { ref, uploadBytes, getDownloadURL, getMetadata } = require('firebase/storage');
    const imageRef = ref(storage, `images/${fileName}`);
    try {
        console.log('Trying to upload an image...');
        await uploadBytes(imageRef, req.image.data);
        req.image.fileName = fileName;
        req.image.url = await getDownloadURL(imageRef);

        const metaData = await getMetadata(imageRef);
        const newSize = (metaData.size / 1024).toFixed();
        console.log('Iimage Uploaded! Download url:', req.image.url, 'Size after compression:', newSize + 'KB', 'name:', fileName, 'type:', mimeType);
        next();
    } catch(err) {
        const error = new HttpError(
            err.message, 500
        );
        return next(error);
    }
};

const deleteImage = async (fileName) => {
    if (!storage) return;
    const { ref, deleteObject } = require('firebase/storage');
    const imageRef = ref(storage, `images/${fileName}`);
    try {
        await deleteObject(imageRef);
        console.log(`Iimage deleted: ${fileName}`);
    } catch(err) {
        throw new HttpError(
            err.message, 500
        );
    }
};

exports.putImage = putImage;
exports.deleteImage = deleteImage;