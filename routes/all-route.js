const express = require('express');
const { addUser, 
        getAllUsers, 
        getUser,
        updateUser,
        deleteUser
    } = require('../controllers/userController');

const router = express.Router();

//User Crud Routes
router.post('/user', addUser);
router.get('/users', getAllUsers);
router.get('/user/:id', getUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

//Exercise Crud Routes


module.exports = {
    routes: router
}