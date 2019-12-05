const http = require("http");

let server = http.createServer(
    (request, response) => {
        response.setHeader("content-Type","text/html");
        response.write("<!DOCTYPE html><html lang='ja'>");
        response.write("<head><title>title</title></head>")
        response.write("<body><h1>Hello</h1><p>Welcome to Node.js!</p>");
        response.write("</body><html>");
        response.end()
    }
);

server.listen(3000);
console.log("Server start");