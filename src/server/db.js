const mongoose = require('mongoose');

const globalWithMongoose = global;
let cached = globalWithMongoose._mongoose;
if (!cached) {
    cached = globalWithMongoose._mongoose = { conn: null, promise: null };
}

async function connect() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        if (!process.env.MONGODB_URL) {
            throw new Error('MONGODB_URL is not set');
        }
        cached.promise = mongoose.connect(process.env.MONGODB_URL);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = connect;
