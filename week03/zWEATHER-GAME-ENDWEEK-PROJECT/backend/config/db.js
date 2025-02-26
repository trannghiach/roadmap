const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
        console.log('Connected to MongoDB');
    } catch(err) {
        console.log('Error connecting to MongoBD: ', err);
        process.exit(1);
    }
};

module.exports = dbConnect;