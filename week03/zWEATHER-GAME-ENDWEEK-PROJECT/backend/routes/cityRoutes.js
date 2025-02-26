const express = require('express');
const { get5RandomCities } = require('../controllers/cityController');
const router = express.Router();

router.get('/cities', get5RandomCities);

module.exports = router;