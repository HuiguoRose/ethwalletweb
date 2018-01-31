'use strict';

let web3 = require('../lib/web3')
let mainAccount = require('../config').mainAccount
let log = require('../lib/log')('rpc');

function unlockAccount(pass, time) {
    try {
        log.info(`unlockAccount ${mainAccount} on ` + new Date())
        return web3.personal.unlockAccount(mainAccount, pass, time)
    } catch (e) {
        log.error(e);
    }
}

// params: [pass,time]

function walletpassphrase(rpc, res) {
    let ret = unlockAccount(rpc.params[0], rpc.params[1]);
    let error = null;
    if (!ret) {
        error = 'walletpassphrase fails.';
        log.error(error);
    }
    res && res.send({id: rpc.id, result: ret, error: error})
}

module.exports = walletpassphrase;
