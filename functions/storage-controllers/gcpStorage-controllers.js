const mongoose = require('mongoose');
const { initializeApp } = require('firebase/app');
const firebaseConfig = require('../firebase-config.json');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const HttpError = require('../models/http-error');

const firebaseApp = initializeApp(firebaseConfig);;
const storage = getStorage(firebaseApp);

const getImage = async (req, res, next) => {

    const path = req.params.path;

    if(!path) {
        const error = new HttpError(
            'Path not defined', 400
        );
        return next(error);
    }

    res.json({
        status: "ok"
    });
};

const putImage = async (req, res, next) => {

    if(!req.image) {
        const error = new HttpError(
            'Image not present', 400
        );
        return next(error);
    }

    const imagesRef = ref(storage, `images/${req.image.filename}`);
    try {
        console.log('Trying to upload an image...');
        await uploadBytes(imagesRef, req.image.data);
        req.image.url = await getDownloadURL(imagesRef);
        console.log('Iimage Uploaded! Download url:', req.image.url);
        next();
    } catch(err) {
        const error = new HttpError(
            err.message, 500
        );
        return next(error);
    }
};

exports.getImage = getImage;
exports.putImage = putImage;