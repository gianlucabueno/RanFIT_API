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
  
      const data = {...req.body, level: "goer",point:0};
      const userRef = await firestore.collection('Users').add(data);

  
      res.send('Registro salvo com sucesso.');
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

const getAllUsers = async(req,res) => {
    try {
        const users = await firestore.collection('Users');
        const datas = await users.get();
        const usersArray = [];
        if(datas.empty) {
            res.status(404).send('No user record found');
        }else {
            datas.forEach(doc => {
                const user = new User(
                    doc.id,
                    doc.datas().name,
                    doc.datas().email,
                    doc.datas().level
                );
                if (user.level != "admin")
                usersArray.push(user);
            });

            const data = {
              users:usersArray
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
            res.status(404).send('User with the given ID not found');
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
        res.send('User record updated successfuly');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        await firestore.collection('Users').doc(id).delete();
        res.send('Record deleted successfuly');
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
      const { email, senha } = req.body;
  
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
      if (userData.senha !== senha) {
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
    updateUser,
    deleteUser,
    getUserByEmail,
    login,
    logout
}