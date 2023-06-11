const firebase = require('../db');
const Exercise= require('../models/exercise');
const firestore = firebase.firestore();


const addExercise = async (req, res) => {
    const points = Math.floor(Math.random() * 100);
  
    try {
  
      const body = { ...req.body, pointsPerExercise: points };
  
      const exerciseRef = await firestore.collection('Exercises').add(body);
      const exerciseId = exerciseRef.id;
  
      res.send(`Registro salvo com sucesso com ID: ${exerciseId}`);
    } catch (error) {
      res.status(400).send(error.message);
    }
};


const getUserExercise = async (req, res) => {
    const { userId } = req.body
    try {
      const querySnapshot = await firestore
        .collection('Exercises')
        .where('idUser', '==', userId)
        .get();
  
      if (querySnapshot.empty) {
        res.status(404).send('Usuario não encontrado');
      } else {
        const exercises = [];
        querySnapshot.forEach((doc) => {
          const exerciseData = doc.data();
          const exerciseId = doc.id;
          const exerciseWithId = { id: exerciseId, ...exerciseData };
          exercises.push(exerciseWithId);
        });
        res.send(exercises);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
}

const updateExercise = async (req, res) => {
    try {
        const body = req.body;
        const exercise = await firestore.collection('Exercises').doc(userId);
        await exercise.update(body);
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