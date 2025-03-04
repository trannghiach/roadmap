const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('Connected to MongoDB');
    } catch(err) {
        console.log('Error connecting to MongoBD: ', err);
        process.exit(1);
    }
};

module.exports = dbConnect;