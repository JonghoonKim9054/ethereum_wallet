const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 80;

/*html 사용하기 위한 설정 */
app.set('views', __dirname + '/public');
app.set('view engine','ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json()); //post 방식의 요청을 받기 위함

let router = require('./router/main')(app); // Main 모듈 기본(경로 설정)
let api = require('./router/api')(app); // API 모듈 

app.listen(port,function(){ 
	console.log('connected 80 port!!');
});


