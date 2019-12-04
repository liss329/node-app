const http = require("http");

let server = http.createServer(
    (request, response) => {
        response.end("Hello Node.js!")
    }
);

server.listen(3000);