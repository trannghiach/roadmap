const City = require('../models/City');

const getRandomCities = async (req, res) => {
    const size = req.params.size ? parseInt(req.params.size) : 1;
    try {
        const cities = await City.aggregate([{$sample: {size}}]);
        res.json(cities);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};

module.exports = {
    getRandomCities
};