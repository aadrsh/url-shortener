const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createUser = async (req, res) => {
    const { email, name, role } = req.body;

    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
                role
            }
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'User creation failed' });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, name, role, isActive } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { email, name, role, isActive }
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'User update failed' });
    }
};

const disableUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { isActive: false }
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'User deactivation failed' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'User deletion failed' });
    }
};

const getAllUsers = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const users = await prisma.user.findMany({
            skip: parseInt(skip),
            take: parseInt(limit),
            include: {
                _count: {
                    select: { links: true }
                }
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users with link count' });
    }
}


module.exports = {
    createUser,
    getUserById,
    updateUser,
    disableUser,
    deleteUser,
    getAllUsers
};