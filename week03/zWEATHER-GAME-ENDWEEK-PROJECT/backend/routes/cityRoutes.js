const express = require('express');
const { getRandomCities } = require('../controllers/cityController');
const router = express.Router();

router.get('/cities/:size?', getRandomCities);

module.exports = router;