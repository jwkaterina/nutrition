const path = require('path');
const os = require('os');
const fs = require('fs');

const Busboy = require('busboy');
const tmpdir = os.tmpdir();

const getFile = (req, res) => {
    if(!req.params.path) {
        res.status(400);
        res.json({ message: 'path param not defined' });
        return;
    }
    const filepath = path.join(tmpdir, req.params.path);
    res.sendFile(filepath);
}

const all = async (req, res, next) => {
    if (req.method !== 'POST' && req.method !== 'PATCH') {
        // Return a "method not allowed" error
        return res.status(405).end();
    }
    const busboy = Busboy({headers: req.headers});

    // This object will accumulate all the fields, keyed by their name
    const fields = {};

    // This object will accumulate all the uploaded files, keyed by their name.
    const uploads = {};

    // This code will process each non-file field in the form.
    busboy.on('field', (fieldname, val) => {
        /**
         *  TODO(developer): Process submitted field values here
         */
        console.log(`Processed field ${fieldname}: ${val}.`);
        fields[fieldname] = val;
    });

    const fileWrites = [];

    // This code will process each file uploaded.
    busboy.on('file', (fieldname, file, {filename}) => {
        // Note: os.tmpdir() points to an in-memory file system on GCF
        // Thus, any files in it must fit in the instance's memory.
        console.log(`Processed file ${filename}`);
        const filepath = path.join(tmpdir, filename);
        uploads[fieldname] = {
            path: filepath,
            filename: filename
        };

        const writeStream = fs.createWriteStream(filepath);
        file.pipe(writeStream);

        file.on('data', (data) => {
            if (!uploads[fieldname].data) {
                uploads[fieldname].data = data;
            } else {
                uploads[fieldname].data = Buffer.concat([uploads[fieldname].data, data]);
            }
        });

        // File was processed by Busboy; wait for it to be written.
        // Note: GCF may not persist saved files across invocations.
        // Persistent files must be kept in other locations
        // (such as Cloud Storage buckets).
        const promise = new Promise((resolve, reject) => {
            file.on('end', () => {
                writeStream.end();
            });
            writeStream.on('close', resolve);
            writeStream.on('error', reject);
        });
        fileWrites.push(promise);
    });

    // Triggered once all uploaded files are processed by Busboy.
    // We still need to wait for the disk writes (saves) to complete.
    busboy.on('finish', async () => {
        await Promise.all(fileWrites);

        for (const file in uploads) {
            // fs.unlinkSync(uploads[file].path);
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
exports.getFile = getFile;