const { Readable } = require('node:stream');
const { ServerResponse } = require('node:http');

function toNodeRequest(webReq, bodyBuffer) {
    const url = new URL(webReq.url);
    const strippedPath = url.pathname.replace(/^\/api\/backend/, '') || '/';

    const stream = Readable.from(bodyBuffer.length > 0 ? [bodyBuffer] : []);

    const nodeReq = stream;
    nodeReq.method = webReq.method;
    nodeReq.url = strippedPath + url.search;
    nodeReq.httpVersion = '1.1';
    nodeReq.httpVersionMajor = 1;
    nodeReq.httpVersionMinor = 1;

    const headers = {};
    webReq.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
    });
    headers['content-length'] = String(bodyBuffer.length);
    nodeReq.headers = headers;
    nodeReq.rawHeaders = Object.entries(headers).flatMap(([k, v]) => [k, v]);
    nodeReq.rawBody = bodyBuffer;

    nodeReq.socket = { remoteAddress: '127.0.0.1', encrypted: false };
    nodeReq.connection = nodeReq.socket;

    return nodeReq;
}

function runExpress(app, nodeReq) {
    return new Promise((resolve, reject) => {
        const nodeRes = new ServerResponse(nodeReq);
        const chunks = [];

        const originalWrite = nodeRes.write.bind(nodeRes);
        const originalEnd = nodeRes.end.bind(nodeRes);

        nodeRes.write = (chunk, encoding, cb) => {
            if (chunk) {
                chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
            }
            if (typeof encoding === 'function') encoding();
            else if (typeof cb === 'function') cb();
            return true;
        };

        nodeRes.end = (chunk, encoding, cb) => {
            if (chunk && typeof chunk !== 'function') {
                chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
            }
            const headers = new Headers();
            const raw = nodeRes.getHeaders();
            for (const [k, v] of Object.entries(raw)) {
                if (v == null) continue;
                if (Array.isArray(v)) {
                    for (const item of v) headers.append(k, String(item));
                } else {
                    headers.set(k, String(v));
                }
            }
            const body = Buffer.concat(chunks);
            resolve(new Response(body.length ? body : null, {
                status: nodeRes.statusCode || 200,
                statusText: nodeRes.statusMessage || '',
                headers,
            }));
            if (typeof chunk === 'function') chunk();
            else if (typeof encoding === 'function') encoding();
            else if (typeof cb === 'function') cb();
            return nodeRes;
        };

        try {
            app(nodeReq, nodeRes);
        } catch (err) {
            reject(err);
        }
    });
}

async function handleWithExpress(app, webReq) {
    const body = webReq.body
        ? Buffer.from(await webReq.arrayBuffer())
        : Buffer.alloc(0);
    const nodeReq = toNodeRequest(webReq, body);
    return runExpress(app, nodeReq);
}

module.exports = { handleWithExpress };
