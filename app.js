const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const url = require("url");

const index_page = fs.readFileSync("./index.ejs", "utf-8");
const other_page = fs.readFileSync("./other.ejs", "utf-8")
const style_css = fs.readFileSync("./style.css", "utf-8");

let server = http.createServer(getFromClient);

server.listen(3000);
console.log("Server start");

/**
 * サーバオブジェクト作成時処理
 */
function getFromClient(req, res){
    let url_parts = url.parse(req.url, true);
    switch(url_parts.pathname){
        case "/":
            let index_obj_content = "これはIndexページです";
            let query = url_parts.query;

            if(!query.msg != undefined){
                index_obj_content += `msg：${ query.msg}`;
            }

            let index_content = ejs.render(index_page, {
                title: "Indexページ",
                content:index_obj_content
            });
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(index_content);
            res.end();
            break;

        case "/other.ejs":
            let other_content = ejs.render(other_page, {
                title: "Other",
                content:"これはOtherページです"
            });
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(other_content);
            res.end();
            break;
        
        case "/style.css":
            res.writeHead(200, {"Content-Type": "text/css"});
            res.write(style_css);
            res.end();
            break;

        default:
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end("no page");
            break;

    }

            
}