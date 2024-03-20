const Busboy = require('busboy');

const all = async (req, res, next) => {
    if (req.method !== 'POST' && req.method !== 'PATCH') {
        // Return a "method not allowed" error
        return res.status(405).end();
    }
    const busboy = Busboy({headers: req.headers, limits: {fileSize: 500000}});

    // This object will accumulate all the fields, keyed by their name
    const fields = {};

    // This object will accumulate all the uploaded files, keyed by their name.
    const uploads = {};

    // This code will process each non-file field in the form.
    busboy.on('field', (fieldname, val) => {
        console.log(`Processed field ${fieldname}: ${val}.`);
        fields[fieldname] = val;
    });

    // This code will process each file uploaded.
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

    // Triggered once all uploaded files are processed by Busboy.
    busboy.on('finish', async () => {

        for (const file in uploads) {
            req[file] = uploads[file];
        }
        for (const field in fields) {
            req.body[field] = fields[field];
        }
        next();
    });

    busboy.end(req.rawBody);
};

exports.all = all;