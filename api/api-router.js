const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ api: "It's alive" });
});

module.exports = router;