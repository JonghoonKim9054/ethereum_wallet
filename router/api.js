const Web3 = require('web3');
const web3 = new Web3();
const url = 'http://localhost:8545';
const db = require('../db/db_conn');

web3.setProvider(new Web3.providers.HttpProvider(url));

module.exports = function(app){
	app.get('/api/test', function(req,res){

		res.send('api test!!');
	});

	app.get('/api/getCoinbase', async (req,res) => {
		let accounts = await web3.eth.getCoinbase();
		res.send(`현재 Coinbase는 \n ${accounts} \n 입니다.`);
		// console.log('현재 Coinbase는 \n'+ accounts +'\n 입니다.');

	});

	app.get('/api/getAccountList', async(req, res) => {
		let accounts;
		accounts = await web3.eth.getAccounts();
		res.send(`현재 AccountsList: ${accounts}`)
		// console.log('현재 AccountsList는 \n'+ accounts +'\n 입니다.');
	
	});

	app.get('/api/getBalance', async(req, res)=>{
		// let account = req.param('account');
		let account = req.query.myAccount;
		let result = await web3.eth.getBalance(account);
		result = web3.utils.fromWei(result,"ether");

		res.send(result);

	});

	app.get('/api/confirmEther', async(req, res)=>{
		// let account = req.param('account');
		let account = req.query.myAccount;
		let result = await web3.eth.getBalance(account);
		result = web3.utils.fromWei(result,"ether");

		res.send(result);

	});

	app.post('/api/newAccount', async(req, res) =>{

		let email = req.body.email;
		let password = req.body.password;
		let result = await web3.eth.personal.newAccount(password);

		let sql = `insert into member (user_email, user_password, user_pub_key) values ('${email}','${password}','${result}')`;
		db.query(sql, function(err, rows, fields){
			if(err){
				console.log(err);
			}
			else{
				console.log(rows);
				
			}
		});
		console.log(password);
		console.log(email);
		res.send('post!!');
	});

	app.post('/api/signIn', async(req, res) => {

		let loginEmail = req.body.loginEmail;
		let loginPassword = req.body.loginPassword;
	
		let sql = `select user_password from member where user_email = '${loginEmail}'`;

		db.query(sql, function(err, rows, fields){
			
			console.log(rows[0].user_password); //DB에서 비밀번호 가져옴
			console.log("넘어온 비밀번호: " + loginPassword); //사용자가 입력 비밀번호

			if(err){
				console.log(err);
				
			}
			else if(rows[0].user_password == loginPassword){ //성공
				res.send("1");
			}else{ //실패
				res.send("0");
			}
		})
		 
	});

	app.post('/api/searchTrans', async(req, res) =>{
		let loginEmail = req.body.loginEmail;

		let sql = `select user_pub_key from member where user_email = '${loginEmail}'`;

		db.query(sql, function(err, rows, fields){

			
			if(err){
				console.log(err);
			}else{
				console.log(rows[0].user_pub_key);
				res.send(rows[0].user_pub_key); //계좌 보내줌

			}
		})
	})

	app.get('/api/getEther', async(req, res)=>{
		let myAccount = req.query.account;
		let coinBase = await web3.eth.getCoinbase();

		let unlockAccount = await web3.eth.personal.unlockAccount(coinBase,'',0);

		let send_result = await web3.eth.sendTransaction({
			from: coinBase,
			to:myAccount,
			value: web3.utils.toWei('100','ether')
		});
		res.send(send_result);
	})
	
	const searchUserPassword = async(myAccount) =>{
		return new Promise((resolve, reject) =>{
			let sql = `select user_password from member where user_pub_key='${myAccount}'`;
			db.query(sql,function(err, rows, fields){
				if(err){
					reject(err);
				}
				else{
					resolve(rows[0].user_password);
				}
			});
		})
	}

	app.get('/api/sendEther', async(req, res) =>{
		let myAccount = req.query.myAccount; //내 계정
		let sendAccount = req.query.sendAccount; //내가 보내는계정
		let coinCount = req.query.coinCount; //보내는 금액

		let user_password = await searchUserPassword(myAccount);

		let unlockAccount = await web3.eth.personal.unlockAccount(myAccount,user_password,0); //내 계좌 lock 해제
		

		let send_result = await web3.eth.sendTransaction({
			from: myAccount,
			to: sendAccount,
			value: web3.utils.toWei(coinCount,'ether')
		
		});
		res.send(send_result);
	
	})
}
