const db = require('../db/db_conn');

module.exports = function(app)
{
    app.get('/', (req,res) => { //http://localhost/ 루트 경로 wallet.html
        res.render('wallet.html');
    });
}
