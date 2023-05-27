const express = require('express');
const { 
    addUser, 
    getAllUsers, 
    getUser,
    updateUser,
    deleteUser,
    login,
    logout
} = require('../controllers/userController');

const { 
    addExercise, 
    getUserExercise, 
    updateExercise,
    deleteExercise,
   
} = require('../controllers/exerciseController');

    

const router = express.Router();

//User Crud Routes
router.post('/user', addUser);
router.get('/users', getAllUsers);
router.get('/user/:id', getUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);
router.post('/login', login);
router.post('/logout', logout);
router.post('/exercise', addExercise);
router.get('/exercises', getUserExercise);

//Exercise Crud Routes


module.exports = {
    routes: router
}