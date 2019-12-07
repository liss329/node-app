const http = require("http");
const fs = require("fs");
const ejs = require("ejs");
const url = require("url");
const qs = require("querystring");

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
            response_index(req, res, url_parts);
            break;

        case "/other":
            response_other(req, res);
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

const data = {
    "Taro": "09-999-999",
    "Hanako": "08-888-888",
    "Sachiko": "07-777-777",
    "Ichiro": "06-666-666"
}

/**
 * indexページのアクセス処理
 */
function response_index(req, res, url_parts){
    let msg = "これはIndexページです";
    let query = url_parts.query;

    if(!query.msg != undefined){
        msg += `msg：${ query.msg}`;
    }

    let index_content = ejs.render(index_page, {
        title: "Indexページ",
        content:msg,
        data:data,
        filename: "data_item"
    });

    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(index_content);
    res.end();
}

/**
 * otherページのアクセス処理
 */
function response_other(req, res){
    let msg = "これはOtherページです"
    
    // POSTアクセス時の処理
    if(req.method == "POST"){
        let body = "";
        
        //データ受信イベント処理
        req.on("data", (data) => {
            body += data;
        });

        // データ受信終了イベント処理
        req.on("end", () => {
            let post_data = qs.parse(body);
            msg += ` msg：${post_data.msg}`;

            let other_content = ejs.render(other_page, {
                title: "Other",
                content:msg
            });
            
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(other_content);
            res.end();
        });
    }else{
        msg = "ページがありません"
        let other_content = ejs.render(other_page, {
            title: "Other",
            content:msg
        });

        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(other_content);
        res.end();
    }
}