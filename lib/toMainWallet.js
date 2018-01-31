'use strict';

let log = require('./log')('wallet');
let web3 = require('./web3');
let localStorage = require('./localStorage');
let config = require('../config');

const {mainAccount, childPassword} = config

const MIN_MONEY = 0.5                // 最小汇总金额，余额大于这个值，才会进行余额汇总

function sendTransaction(to, money, from) {
    try {
        web3.personal.unlockAccount(from, childPassword, 10)
        let gasPrice = web3.eth.gasPrice;
        let gas = 21000
        let fee = gas * gasPrice
        let txid = web3.eth.sendTransaction({
            from: from,
            to: to,
            value: web3.toWei(money, 'ether') - fee,
            gas: gas,
            gasPrice: gasPrice
        })
        web3.personal.lockAccount(from)
        return txid
    } catch (e) {
        log.error(e);
    }
}

// 把子账号的钱转到主账户
function toMainWallet() {
    console.log('send ether to main account at ' + new Date());
    localStorage.getAccounts(res => {
        res.map(account => {
            let address = account.address
            if (address != mainAccount) {
                // let etherWei = web3.eth.getBalance(address)
                // let ether = web3.fromWei(etherWei)
                let ether = account.amount
                if (ether > MIN_MONEY) {
                    log.info(`send ${address} money: ${ether} to main wallet ${mainAccount}`)
                    let txId = sendTransaction(mainAccount, ether, address);
                    log.info(`txId: ${txId}`)
                }
            }
        })
    })
}

function execute() {
    try {
        toMainWallet()
    } catch (e) {
        log.errof("toMainWallet error", e)
    }
}

module.exports = execute;