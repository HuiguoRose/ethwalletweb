'use strict';

let app = require('express')();
let bodyParser = require('body-parser');
let sync = require('./lib/sync');
let config= require('./config')

// 定时任务
require('./cron');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// apis
let getBalance = require('./api/getBalance');
let newAccount = require('./api/newAccount');
let getTransaction = require('./api/getTransaction');
let listTransactions = require('./api/listTransactions');
let sendTransaction = require('./api/sendTransaction');
let unlockAccount = require('./api/unlockAccount');
let lockAccount = require('./api/lockAccount');

let rpcMethods = {
	'getbalance': getBalance,
	'sendtoaddress': sendTransaction,
	'gettransaction': getTransaction,
	'listtransactions': listTransactions,
	'getnewaddress': newAccount,
	'walletpassphrase': unlockAccount,
	'walletlock': lockAccount,
}

// ip access control
const allowIPs = {}
config.rpcallowip.map(ip => {
    allowIPs[ip] = true
})

app.use('/', function(req, res, next){
    let clientIP = req.ip.replace(/.*:/, '');
    if (!allowIPs[clientIP]) {
        console.log("not allow ip", clientIP);
        res.destroy()
    } else {
        next()
    }
})

// basic auth
app.use('/', function(req, res, next){
    var authorization = req.headers['authorization']
    if (!authorization || !validAuth(authorization)) {
        res.append('WWW-Authenticate', 'Basic realm="jsonrpc"')
        res.status(401).end();
    } else {
        next()
    }
})

function validAuth(authorization) {
    var user = new Buffer(authorization.replace("Basic ", ""), "base64").toString().split(":");
    return config.rpcuser == user[0] && config.rpcpassword == user[1]
}

app.post('/', function(req, res){
	var body;
	for (var key in req.body) {
		body = key;
	}
	console.log(body);
	let rpc = JSON.parse(body);
	let method = rpcMethods[rpc.method];
	if (!method) {
		return res.send({error: 'not implments!', result: []})
	}
	method(rpc, res);
});

app.listen(9100, function(){
  console.log('listening on 0.0.0.0:3000');
});
