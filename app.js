const http = require("http");
const fs = require("fs");

let server = http.createServer(getFromClient);
server.listen(3000);
console.log("Server start");

/**
 * サーバオブジェクト作成時処理
 */
function getFromClient(req, res){
    fs.readFile("./index.html", "utf-8", 
        (error, data) => {
            let content = data.replace(/dummy_title/g, "タイトルです").replace(/dummy_content/g, "コンテンツです");
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(content);
            res.end();            
        }
    );
}