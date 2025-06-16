import { format as formatURL } from 'url';

const { 
    DB_PASSWORD: db_password,
    DB_USERNAME: db_username,
    DB_HOSTNAME: db_hostname,
    DB_PORT: db_port,
    DB_PROTOCOL: db_protocol,

    HOST: host_ip,
    PORT: host_port,

    EXPIRATION_DELAY: expiration_delay,
} = process.env;

const databasePass = db_password && encodeURIComponent(db_password).replace(/%2F/g, '%252F');
const databaseAuth = db_username && (db_username + (databasePass ? `:${databasePass}` : ''));

export const DATABASE_URL = formatURL({ protocol: 'http', auth: databaseAuth, hostname: db_hostname, port: db_port })
    .replace(/^http/i, db_protocol);

export const DATABASE_NAME = process.env.DB_NAME;
export const MASTER_KEY = process.env.MASTER_KEY;

export const HOST = host_ip || '0.0.0.0';
export const PORT = parseInt(host_port) || 3000;

const delay = parseInt(expiration_delay) || 30;
export const EXPIRATION_DELAY = delay * 60 * 1000;

