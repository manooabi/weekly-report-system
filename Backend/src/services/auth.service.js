const prisma = require('../config/database');
const { hashPassword, comparePassword
 } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

async function registerUser({ name, email, password }) {
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (existingUser) {
        const error = new Error('Email is already registered');
        error.statusCode = 409;
        throw error;
    }

    const teamMemberRole = await prisma.role.findUnique({
        where: {
            code: 'TEAM_MEMBER'
        }
    });

    if (!teamMemberRole) {
        const error = new Error('Default user role is not configured');
        error.statusCode = 500;
        throw error;
    }

    const passwordHash = await hashPassword(password);

   const user = await prisma.user.create({
    data: {
        name,
        email,
        passwordHash,
        roleId: teamMemberRole.id
    },
    select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        isActive: true,
        createdAt: true
    }
});

    return user;
}
async function loginUser({ email, password }) {
    const user = await prisma.user.findUnique({
        where: {
            email
        },
        include: {
            role: true
        }
    });

    if (!user || !user.isActive) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const passwordMatches = await comparePassword(
        password,
        user.passwordHash
    );

    if (!passwordMatches) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken({
        userId: user.id,
        role: user.role.code
    });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role.code
        }
    };
}
module.exports = {
    registerUser,
    loginUser
};