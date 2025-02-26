const City = require('../models/City');

const get5RandomCities = async (req, res) => {
    try {
        const cities = await City.aggregate([{$sample: {size: 5}}]);
        res.json(cities);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};

module.exports = {
    get5RandomCities
};