const router = require('express').Router();

const Users = require('./user-model.js');
const restricted = require('../api/configure-middleware');

router.get('/', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

router.get('/logout', (req, res) => {
  console.log(req.session);
  if (req.session){
    req.session.destroy(error => {
      if (error) {
        res.send('error logging out');
      } else {
        res.send('good bye');
      }
    })
  }
});

module.exports = router;