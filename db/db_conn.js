const mysql = require('mysql');
const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1111',
    database:'wallet'
});


con.connect();
console.log('DB Connecte complete 3306 port');
//데이터 베이스 연결

module.exports = con;