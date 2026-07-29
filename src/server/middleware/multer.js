const Busboy = require('busboy');

const all = async (req, res, next) => {
    if (req.method !== 'POST' && req.method !== 'PATCH') {
        return res.status(405).end();
    }

    const busboy = Busboy({headers: req.headers, limits: {fileSize: 50000000}});

    const fields = {};

    const uploads = {};

    busboy.on('field', (fieldname, val) => {
        console.log(`Processed field ${fieldname}: ${val}.`);
        if(val !== 'null') fields[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, {filename, mimeType}) => {
        console.log(`Processed file ${filename}`);
        const dataContainer = {};

        file.on('data', (data) => {
            if (!dataContainer.data) {
                dataContainer.data = data;
                dataContainer.mimeType = mimeType;
            } else {
                dataContainer.data = Buffer.concat([dataContainer.data, data]);
            }
        });

        uploads[fieldname] = dataContainer;
    });

    busboy.on('finish', async () => {

        if(Object.keys(uploads).length !== 0) {
            for (const file in uploads) {
                req[file] = uploads[file];
            }
        }
        
        for (const field in fields) {
            req.body[field] = fields[field];
        }
        next();
    });

    if (req.rawBody) {
        busboy.end(req.rawBody);
    } else {
        req.pipe(busboy);
    }
};

exports.all = all;