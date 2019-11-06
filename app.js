const express = require('express');
const app = express();
const cors = require('cors');

const { ENVIRONMENT, PORT } = process.env;
const IS_DEVELOPMENT = ENVIRONMENT === 'development';

// to pass in envireonment vars, run in terminal:
// ENVIRONMENT=development nodemon app.js

// middleware
// allows us to receive and send json
app.use(express.json());
// let any domain make a request to this api
app.use(cors({
  origin: IS_DEVELOPMENT ? 'http://localhost:3000' : 'https://furtive-wall.surge.sh'
}));
// to restrict to only request from google.com:
// to test use fetch('http://localhost:8000/api/posts') in the browser console
// from a particular website
// app.use(cors({
//   origin: 'https://www.google.com'
// }));

const db = {
  posts: [
    {
      id: 1,
      title: 'Post 1',
      body: 'something here...'
    },
    {
      id: 2,
      title: 'Post 2',
      body: 'something else here...'
    }
  ]
};

app.get('/api/posts', (request, response) => {
  response.json(db.posts);
});

app.post('/api/posts', (request, response) => {
  const post = request.body;
  post.id = db.posts.length + 1;
  db.posts.push(post);
  response.json(post);
});

app.get('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    response.json(post);
  } else {
    response.status(404).send();
  }
});

app.delete('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    db.posts = db.posts.filter((post) => {
      return post.id !== id;
    });
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.put('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    Object.assign(post, request.body)
    response.json(post);
  } else {
    response.status(404).send();
  }
});

// so that when heroku runs, it passes in the port number
// process is global var for node, like window is for browser
// else, for local use will go to 8000
app.listen(process.env.PORT || 8000);
