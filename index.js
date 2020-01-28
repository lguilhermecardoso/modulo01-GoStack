const express = require('express');

const server = express();

server.use(express.json())

const users = ['Diego', 'Claudio', 'Victor']

//Middleware GLOBAL
server.use((req, res, next) => {

  console.time('Request')

  console.log(`Método: ${req.method}: URL: ${req.url}`);

  next();

  console.timeEnd('Request')

});

// Middleware Local
  function checkUsersExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({error: 'User name is required'})
  }

  return next();
}
function checkUsersInArray(req, res, next) {
  if(!users[req.params.index]) {
    return res.status(400).json({error: 'User does not exists'});
  }
}


server.get('/users', (req, res) => {
  return res.json(users);
})

server.post('/users', checkUsersExists, (req, res) => {
  
  const { name } = req.body
  
  users.push(name);
  
  return res.json(users);
  
})

server.delete('/users/:index', checkUsersInArray, (req, res) => {

  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
  
})

server.put('/users/:index', checkUsersExists, checkUsersInArray, (req, res) => {

  const { index } = req.params;

  const { name } = req.body;

  users[index] = name;

  return res.json(users);

});

server.get('/users/:index', checkUsersInArray,  (req, res) => {

  const { index } = req.params;

  return res.json(users[index]);

});

server.listen(3333)