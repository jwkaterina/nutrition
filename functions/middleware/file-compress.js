const sharp = require("sharp");

const compressFile = async (req, res, next) => {

    const size = (req.headers['content-length'] / 1024).toFixed(0);
    console.log('Size before compression:', size + 'KB');
    const mimeType = req.image.mimeType;

    if(size < 500) return next();

    let compressedBuffer;
    try {
        console.log('Compressing...');
        if(mimeType == 'image/png') {
            compressedBuffer = await sharp(req.image.data)
                .png()
                .toBuffer();
        } else if(mimeType == 'image/jpeg' || mimeType == 'image/jpg') {
            compressedBuffer = await sharp(req.image.data)
                .jpeg()
                .toBuffer();
        }
    } catch(err) {
        const error = new HttpError(
            err.message, 500
        );
        return next(error);
    }

    req.image.data = compressedBuffer;
    next();
}

exports.compressFile = compressFile;