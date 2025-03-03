const City = require('../models/City');

const getRandomCities = async (req, res) => {
    const size = req.params.size ? parseInt(req.params.size) : 1;
    console.log('size: ', size);
    try {
        const cities = await City.aggregate([{$sample: {size}}]);
        console.log('cities: ', cities);
        res.json(cities);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};

module.exports = {
    getRandomCities
};