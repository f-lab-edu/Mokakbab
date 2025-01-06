const http = require("http");
const mysql = require("mysql2");

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT),
});

const server = http.createServer((req, res) => {
    // MySQL 연결 테스트
    connection.connect((err) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Database connection failed");
            console.error("Error connecting to database:", err);
            return;
        }

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Database connection success");

        connection.end();
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
