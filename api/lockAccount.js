'use strict';

let web3 = require('../lib/web3')
let mainAccount = require('../config').mainAccount
let log = require('../lib/log')('rpc');

function lockAccount() {
    try {
        log.info(`lockAccount ${mainAccount} on ` + new Date())
        return web3.personal.lockAccount(mainAccount)
    } catch (e) {
        log.error(e);
    }
}

// params: []

function walletlock(rpc, res) {
    let ret = lockAccount();
    let error = null;
    if (!ret) {
        error = 'walletlock fails.';
        log.error(error);
    }
    res && res.send({id: rpc.id, result: ret, error: error})
}

module.exports = walletlock;
