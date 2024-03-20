const Busboy = require('busboy');

const all = async (req, res, next) => {
    if (req.method !== 'POST' && req.method !== 'PATCH') {
        return res.status(405).end();
    }
    const busboy = Busboy({headers: req.headers, limits: {fileSize: 500000}});

    const fields = {};

    const uploads = {};

    busboy.on('field', (fieldname, val) => {
        console.log(`Processed field ${fieldname}: ${val}.`);
        if(val !== 'null') fields[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, {filename}) => {
        console.log(`Processed file ${filename}`);
        dataContainer = {};

        file.on('data', (data) => {
            if (!dataContainer.data) {
                dataContainer.data = data;
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

    busboy.end(req.rawBody);
};

exports.all = all;