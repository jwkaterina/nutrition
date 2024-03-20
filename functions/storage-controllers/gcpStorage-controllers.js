const uuid = require('uuidv1');
const { initializeApp } = require('firebase/app');
const firebaseConfig = require('../firebase-config.json');
const { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } = require('firebase/storage');

const HttpError = require('../models/http-error');

const firebaseApp = initializeApp(firebaseConfig);;
const storage = getStorage(firebaseApp);

const putImage = async (req, res, next) => {

    if(!req.image) {
        return next();
    }

    const fileName = uuid();
    const imageRef = ref(storage, `images/${fileName}`);
    try {
        console.log('Trying to upload an image...');
        await uploadBytes(imageRef, req.image.data);
        req.image.fileName = fileName;
        req.image.url = await getDownloadURL(imageRef);
        console.log('Iimage Uploaded! Download url:', req.image.url);
        next();
    } catch(err) {
        const error = new HttpError(
            err.message, 500
        );
        return next(error);
    }
};

const deleteImage = async (fileName) => {
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