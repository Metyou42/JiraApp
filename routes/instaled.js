const { Router } = require('express');

const router = Router();

router.post('/', (req, res) => {
    res.json({ message: 'good' });
});

module.exports = router;
