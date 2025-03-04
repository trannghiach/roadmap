const mongoose = require('mongoose');

const City = mongoose.model('City', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    country: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: true,
        unique: true
    },
    lon: {
        type: String,
        required: true,
    }
}));

module.exports = City;

