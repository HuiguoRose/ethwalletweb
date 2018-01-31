'use strict';

let config = require('../config');
let web3 = require('../lib/web3');
let log = require('../lib/log')('rpc');
let localStorage = require('../lib/localStorage');

function newAccount() {
    let address = web3.personal.newAccount(config.childPassword);
    localStorage.insertAccount(address)
    return address;
}

/**
 * 生成地址
 */
function getnewaddress(rpc, res) {
    let ret = newAccount();
    let error = null;
    if (!ret) {
        error = 'new address error.';
        log.error(error);
    }
    res.send({id: rpc.id, result: ret, error: error})
}

module.exports = getnewaddress;
