const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/user-model.js');
const uuid = require('uuid');

router.post('/register', (req, res) => {
    const {username, password} = req.body;
    
    const bcryptHash = bcrypt.hashSync(password, 10);

    const user = {
        username,
        password: bcryptHash
    };

    Users.add(user)
    .then(saved => {
        res.status(201).jason(saved);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        // it's taking the bcrypt thing and breaking it into parts
        // <algo><10><foo><theactualhash>
        // recomputes the <theactualhash>
        // compares against the credentials req.body.password
        if (user && bcrypt.compareSync(password, user.password)) {
          // if the password likez
          // let's generate a unique id to simbolize this "login"
          // let's shove this sessionId into the sessions array
          // let's do a Set-Cookie with the sessionId
          // this way the client will send back the sessionId
          // automagically (with subsequent requests)!
          const sessionId = uuid();
          activeSessions.push(sessionId);
          res.cookie('sessionId', sessionId, { maxAge: 900000 });
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  
  function protected(req, res, next) {
    // let's pull the session id from the Cookie header
    // if the id is there, let's see if that id exists inside activeSessions
    // if it does next();
    if (activeSessions.includes(req.cookies.sessionId)) {
      next()
    } else {
      res.status(401).json({
        message: `
          Your cookie is either not there, or it contains no valid sessionId
      `})
    }
  }
  
  router.protected = protected;

module.exports = router;