'use strict';

let web3 = require('../lib/web3')
let log = require('../lib/log')('rpc');

let {mainAccount} = require('../config')

function sendTransaction(to, money, from) {
    try {
        let gasPrice = web3.eth.gasPrice;
        let gas = web3.eth.estimateGas({from: from, to: to, gasPrice: gasPrice, value: web3.toWei(money, 'ether')})
        return web3.eth.sendTransaction({from: from, to: to, value: web3.toWei(money, 'ether'), gas: gas, gasPrice: gasPrice})
    } catch (e) {
        log.error(e);
    }
}

// params: [to,money,comment,from]

function sendtoaddress(rpc, res) {
    let ret = sendTransaction(rpc.params[0], rpc.params[1], mainAccount);
    let error = null;
    if (!ret) {
        error = 'sendtoaddress fails.';
        log.error(error);
    }
    res && res.send({id: rpc.id, result: ret, error: error})
}

module.exports = sendtoaddress;