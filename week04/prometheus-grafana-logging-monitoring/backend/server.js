const express = require('express');
const dbConnect = require('./config/db');
const cityRoutes = require('./routes/cityRoutes');
const cors = require('cors');

const client = require('prom-client');

const app = express();

// //Configure custom metric: http request counter:
// const httpRequestCounter = new client.Counter({
//   name: 'http_request_total',
//   help: 'Total requests received',
//   labelNames: ['method', 'route', 'status_code'],
// });

// //Middleware request counter:
// app.use((req, res, next) => {
//   req.on('finish', () => {
//     httpRequestCounter.inc({ method: req.method, route: req.path, status_code: res.statusCode });
//   });
//   next();
// });
// Or use the available one:

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

//Endpoint /metrics for the Prometheus to collect
app.get('/metrics', async(req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
const allowedOrigins = [
    process.env.REACT_URL, 
  ];
  
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"]
    })
  );

dbConnect();

app.use('/api', cityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});