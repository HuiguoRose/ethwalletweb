'use strict';

let config = require('../config');
let web3 = require('../lib/web3');
let localStorage = require('../lib/localStorage');
let log = require('../lib/log')('rpc');

let {mainAccount} = config

// 余额等于主地址余额 + 用户地址余额
function getBalance(callback) {
    let balance = web3.fromWei(web3.eth.getBalance(mainAccount), 'ether');
    localStorage.getAmounts((amount) => {
        callback && callback(amount * 1 + balance)
    })
}

/**
 * 生成地址
 */
function getbalance(rpc, res) {
    getBalance(ret => {
        let error = null;
        if (!ret) {
            error = 'getBalance error.';
            log.error(error);
        }
        res.send({id: rpc.id, result: ret, error: error})
    })
}

module.exports = getbalance;
