const bcrypt = require('bcryptjs');

const Users = require('../users/user-model.js');

module.exports = (req, res, next) => {
  // if this is not the first visit,
  // and if the user logged in successfully,
  // there should be a session object in the "active sessions array"
  // with an id that corresponds to the "monkey=sessionId"
  // that is coming with the Cookie header
  if (req.session.loggedInUser) {
    next();
  } else {
    res.status(400).json({
      message: 'no cookie, OR cookie without a valid session id in the monkey'
    });
  }
};