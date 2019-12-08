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

const data = {msg: "no message"};

const data2 = {
    "Taro": ["taro@yamada", "09-999-999", "Tokyo"],
    "Hanako": ["hanako@flower", "08-888-888", "Yokohama"],
    "Sachiko": ["sachi@happy", "07-777-777", "Nagoya"],
    "Ichiro":["ichi@baseball", "06-666-666", "USA"]
}

/**
 * indexページのアクセス処理
 */
function response_index(req, res, url_parts){

    if(req.method == "POST"){
        let body = "";

        req.on("data", (data) => {
            body += data;
        });

        req.on("end", () => {
            // POSTによるアクセス時は送信されたmsgに応じて、グローバル変数dataのmsgプロパティを書き換える
            data.msg = qs.parse(body).msg;

            //クッキーの保存
            setCookie("msg", data.msg, res);

            write_index(req, res);
        });

    }else{
        write_index(req, res);
    }
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
                content:msg,
                data: data2,
                filename: "data_item"
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

/**
 * indexページの表示
 */
function write_index(req, res){ 
    let msg = "※伝言を表示します";
    let cookie_data = getCookie("msg", req);
    let index_content = ejs.render(index_page, {
        title: "Index",
        content: msg,
        data: data,
        cookie_data: cookie_data
    });

    res.writeHead(200, {"Content-Type": "text/html"});
    res.write(index_content);
    res.end();
}

/**
 * クッキーの値を設定
 */
function setCookie(key, value, res){
    let cookie = escape(value);
    res.setHeader("Set-Cookie", [key + "=" + cookie]);
}

/**
 * クッキーの値を取得
 */
function getCookie(key, req){
    let cookie_data = req.headers.cookie != undefined ?
        req.headers.cookie : "";
    let data = cookie_data.split(";");
    for(let i in data){
        if(data[i].trim().startsWith(key + "=")){
            let result = data[i].trim().substring(key.length + 1);
            return unescape(result);
        }
    }
    return "";
}