require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const databaseUrl = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
    host: databaseUrl.hostname,
    port: Number(databaseUrl.port),
    user: databaseUrl.username,
    password: databaseUrl.password,
    database: databaseUrl.pathname.substring(1),
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;