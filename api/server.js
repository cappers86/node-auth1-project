const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/user-router.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session({
  name: 'monkey',          // session id
  secret: 'keep it secret',
  cookie: {
    maxAge: 1000 * 60,
    secure: false,         // https only
    httpOnly: false,       // can we get at the cookie from JS?
  },
  resave: false,
  // if we don't explicitly do something with the session
  // like adding extra properties (isLoggedIn for example)
  // don't respond with a Set-Cookie of "monkey=someIdSession"
  saveUninitialized: false, // good GDPR
  store: new KnexSessionStore({
    knex: require('../database/dbConfig.js'), // configured instance of knex
    tablename: 'sessions', // table that will store sessions inside the db, name it anything you want
    sidfieldname: 'sid', // column that will hold the session id, name it anything you want
    createtable: true, // if the table does not exist, it will create it automatically
    clearInterval: 1000 * 60 * 60, // time it takes to check for old sessions and remove them from the database to keep it clean and performant
  }),
}));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  if (req.session.seenYouBefore) {
    // unless we "do something" with the session
    // like adding a "seenYouBefore" to the session object
    // if saveUninitialized=false NO COOKIE GETS SENT
    res.json('welcome back')
  } else {
    req.session.seenYouBefore = true;
    res.json('nice to meed you! here is a cookie')
  }
});

module.exports = server;