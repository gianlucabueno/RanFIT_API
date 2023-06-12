const firebase = require('../db');
const User= require('../models/user');
const firestore = firebase.firestore();


const addUser = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Verificar se o e-mail já está em uso
      const snapshot = await firestore
        .collection('Users')
        .where('email', '==', email)
        .limit(1)
        .get();
  
      if (!snapshot.empty) {
        throw new Error('E-mail já cadastrado. Por favor, escolha outro.');
      }
  
      const data = {...req.body, level: "goer",points:0};
      const userRef = await firestore.collection('Users').add(data);

  
      res.send('Registro salvo com sucesso.');
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

const getAllUsers = async(req,res) => {
    try {
        const users = await firestore.collection('Users');
        const body = await users.get();
        const usersArray = [];
        if(body.empty) {
            res.status(404).send('Usuario não encontrado');
        }else {
          body.forEach(doc => {
                const { name, email, level } = doc.data();
                const user = new User(
                    doc.id,
                    name,
                    email,
                    level
                );
                if (user.level != "admin")
                usersArray.push(user);
          });

          const data = {
            data:{
              users:usersArray
            }
          }
          console.log("body: ",body)
          console.log("userArray: ",usersArray)
          res.send(data);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getRanking = async(req,res) => {
  try {
      const users = await firestore.collection('Users');
      const body = await users.get();
      const rankingArray = [];
      if(body.empty) {
          res.status(404).send('Usuario não encontrado');
      }else {
        body.forEach(doc => {
              const { name, points } = doc.data();
              const user = new User(
                  doc.id,
                  name,
                  points
              );
              if (user.level != "admin")
              rankingArray.push(user);
        });

        const data = {
          data:{
            ranking:rankingArray.sort((a,b)=> a.points - b.points)
          }
            
        }
          
        res.send(data);
      }
  } catch (error) {
      res.status(400).send(error.message);
  }
}

const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await firestore.collection('Users').doc(id);
        const data = await user.get();
        if(!data.exists) {
            res.status(404).send('Usuario com esse ID não encontrado');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user =  await firestore.collection('Users').doc(id);
        await user.update(data);
        res.send('Usuario atualizado com sucesso');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        await firestore.collection('Users').doc(id).delete();
        res.send('Usuario deletado com sucesso');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getUserByEmail = async (email) => {
    const querySnapshot = await firestore
      .collection('Users')
      .where('email', '==', email)
      .limit(1)
      .get();
  
    if (querySnapshot.empty) {
      return null; // Retorna null se o usuário não for encontrado
    }
  
    const userDocument = querySnapshot.docs[0];
    const userData = userDocument.data();
    
    return {
      id: userDocument.id,
      ...userData,
    };
}


const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Consulte o Firestore para obter o usuário com base no e-mail
      const querySnapshot = await firestore
        .collection('Users')
        .where('email', '==', email)
        .limit(1)
        .get();
  
      if (querySnapshot.empty) {
        throw new Error('Usuário não encontrado. Verifique o e-mail e a senha.');
      }
  
      // Obtenha o primeiro documento retornado pela consulta
      const userDocument = querySnapshot.docs[0];
      const userData = userDocument.data();
  
      // Verifique a senha
      if (userData.password !== password) {
        throw new Error('Senha incorreta. Verifique o e-mail e a senha.');
      }
  
      // Armazenar o ID do usuário na sessão
      req.session.userId = userDocument.id;
  
      // Retornar as informações do usuário para o front-end
      const data = {
        user:{
            _id: userDocument.id,
            level: userData.level,
            name: userData.name,
            email: userData.email
        }
       
      };
  
      res.send(data);
    } catch (error) {
      res.status(401).send(error.message);
    }
}

const logout = (req, res) => {
    // Limpar informações da sessão
    req.session.userId = null;
    req.session.userEmail = null;
  
    res.send('Logout bem-sucedido!');
}


module.exports = {
    addUser,
    getAllUsers,
    getUser,
    getRanking,
    updateUser,
    deleteUser,
    getUserByEmail,
    login,
    logout
}