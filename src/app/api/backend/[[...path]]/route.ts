// eslint-disable-next-line @typescript-eslint/no-var-requires
const { app: expressApp } = require('@/server/express-app');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const connect = require('@/server/db');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { handleWithExpress } = require('@/server/adapter');

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function handler(request: Request): Promise<Response> {
    try {
        await connect();
    } catch (err) {
        console.error('DB connection failed', err);
        return Response.json({ message: 'Database connection failed.' }, { status: 500 });
    }
    return handleWithExpress(expressApp, request);
}

export {
    handler as GET,
    handler as POST,
    handler as PATCH,
    handler as DELETE,
    handler as OPTIONS,
};
