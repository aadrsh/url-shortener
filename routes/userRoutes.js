const express = require('express');

const {
    createUser,
    getUserById,
    updateUser,
    disableUser,
    enableUser,
    deleteUser,
    getAllUsers
} = require('../controllers/userController');

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.patch('/:id/disable', disableUser);
router.patch('/:id/enable', enableUser);
router.delete('/:id', deleteUser);

module.exports = router;