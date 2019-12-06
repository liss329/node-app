const http = require("http");
const fs = require("fs");
const ejs = require("ejs");

const index_page = fs.readFileSync("./index.ejs", "utf-8");
let server = http.createServer(getFromClient);
server.listen(3000);
console.log("Server start");

/**
 * サーバオブジェクト作成時処理
 */
function getFromClient(req, res){
    let content = ejs.render(index_page);
    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(content);
    res.end();            
}