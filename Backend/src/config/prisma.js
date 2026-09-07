
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const adapter = new PrismaMariaDb({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'weekly_report_system'
});

const prisma = new PrismaClient({
    adapter
});

module.exports = prisma;

