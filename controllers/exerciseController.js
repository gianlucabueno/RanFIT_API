const firebase = require('../db');
const User= require('../models/user');
const firestore = firebase.firestore();


const addExercise = async (req,res) => {
    const userId = req.session.userId;
    points = Math.floor(Math.random() * 100)
    try {
        const data = {...req.body, idUser: userId,pointsPerExercise: points};
        console.log(data)
        await firestore.collection('Exercises').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}



const getUserExercise= async (req, res) => {
    const userId = req.session.userId;
    try {
        const exercise = await firestore.collection('Exercises').doc(userId);
        const data = await exercise.get(exercise);
        if(!data.exists) {
            res.status(404).send('User with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateExercise = async (req, res) => {
    try {
        const data = req.body;
        const exercise = await firestore.collection('Exercises').doc(userId);
        await exercise.update(data);
        res.send('User record updated successfuly');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteExercise = async (req, res) => {
    try {
        const id = req.params.id;
        await firestore.collection('Users').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    addExercise,
    getUserExercise,
}