require('dotenv').config();
const express = require('express');
const dbConnect = require('./config/db');
const cityRoutes = require('./routes/cityRoutes');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

dbConnect();

app.use('/api', cityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});