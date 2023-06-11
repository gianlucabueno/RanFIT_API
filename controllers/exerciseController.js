const firebase = require('../db');
const Exercise= require('../models/exercise');
const firestore = firebase.firestore();
const exerciseService = require('../services/exerciseService')


const addExercise = async (req, res) => {
  const { distance, duration } = req.body
  //const points = exerciseService.calculatePoints(distance,duration );
  const points = Math.floor(Math.random() * 100);
  
    try {
  
      const body = { ...req.body, pointsPerExercise: points };
  
      const exerciseRef = await firestore.collection('Exercises').add(body);
      const exerciseId = exerciseRef.id;
  
      res.send('Registro salvo com sucesso');
    } catch (error) {
      res.status(400).send(error.message);
    }
};


const getUserExercise = async (req, res) => {
    const { userId } = req.body
    console.log('Valor de userId:', userId);
    try {
      const collectionRef = firestore.collection('Exercises');
      const query = collectionRef.where('UserId', '==', userId);
      const querySnapshot = await query.get();
      
  
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
        await firestore.collection('Exercises').doc(id).delete();
        res.send('Exercicio deletado com sucesso');
    } catch (error) {
        res.status(400).send(error.message);
    }
}


module.exports = {
    addExercise,
    getUserExercise,
    deleteExercise,
}