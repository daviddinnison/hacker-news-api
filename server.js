'use strict'; 

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { DATABASE, PORT } = require('./config');

const app = express();

const {HackerBlog} = require('./models');

app.use(morgan(':method :url :res[location] :status'));

app.use(bodyParser.json());

//Get
// app.get('/api/stories', (req, res) => {
//   res.send('hello world');
// });

//find way to return 20 sorted by most voted
app.get('/api/stories', (req, res) => {
  res.json(HackerBlog.get());
})




//Post
app.post('/api/stories', jsonParser, (req, res) => {
  const requiredFields = ['title', 'url'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!field in req) {
      let message = `Missing \$(field)\ in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = HackerBlog.create(req.body.title, req.body.url);
  res.status(201).json(item);
});


//Post
//add one vote to story
app.put('/api/stories/:id', jsonParser, (req, res) => {
  
  const requiredFields = ['id'];
  for (let i = 0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!field in req.body) {
      const message = `Missing \$field$\ in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  const votes = req.body.votes;


//work on this
  knex('news')
  .where('id', '=', req.params.id)
  .increment('votes', 1)
  res.status(204).end();
})







//old post
// app.put('/api/stories/:id', jsonParser, (req, res) => {
  
//   const requiredFields = ['id'];
//   for (let i = 0; i<requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if(!field in req.body) {
//       const message = `Missing \$field$\ in request body`
//       console.error(message);
//       return res.status(400).send(message);
//     }
//   }
//   if (req.params.id !== req.body.id) {
//     const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
//     console.error(message);
//     return res.status(400).send(message);
//   }
//   console.log(`Updating vote on item \`${req.params.id}\``);
//   const votes = req.body.votes;
//   HackerBlog.update({
    
//     votes: votes + 1
//   });
//   res.status(204).end();
// })








let server;
let knex;
function runServer(database = DATABASE, port = PORT) {
  return new Promise((resolve, reject) => {
    try {
      knex = require('knex')(database);
      server = app.listen(port, () => {
        console.info(`App listening on port ${server.address().port}`);
        resolve();
      });
    }
    catch (err) {
      console.error(`Can't start server: ${err}`);
      reject(err);
    }
  });
}

function closeServer() {
  return knex.destroy().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing servers');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => {
    console.error(`Can't start server: ${err}`);
    throw err;
  });
}

module.exports = { app, runServer, closeServer };