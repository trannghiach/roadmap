const http = require('http');

const server = http.createServer((req, res) => {
    if(req.url === "/") {
        res.end('<h1>Home</h1>');
    }
});

const PORT = 3000;

server.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));