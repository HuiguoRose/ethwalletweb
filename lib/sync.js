'use strict';

const fs = require('fs')
const web3 = require('./web3')
const db = require('./db');
const localStorage = require('./localStorage')
const log = require('./log')('sync');
const DEFAULT_SPEED = 10 * 1000;
const speed = require('../config').speed || DEFAULT_SPEED;

let lastBlock = 0;

function writeCurrentBlock(currentBlock) {
    lastBlock = currentBlock
    fs.writeFileSync('CURRENT', currentBlock)
}

function readCurrentBlock(callback) {
    fs.stat('CURRENT', (err) => {
        if (err) {
            writeCurrentBlock(3748305)
        } else {
            lastBlock = fs.readFileSync('CURRENT', 'utf-8') * 1
        }
        callback && callback()
    })
}

function updateAmount(address) {
    let balance = web3.fromWei(web3.eth.getBalance(address).toString(), 'ether')
    localStorage.updateAccount(address, balance)
}

function sync() {
    let blockNumber = 0
    try {
        blockNumber = web3.eth.blockNumber
        if (blockNumber >= lastBlock) {
            log.info("read block", lastBlock, "txs");
            let addresses = localStorage.getAddresses()

            web3.eth.getBlock(lastBlock, (error, block) => {

                let promises = []
                block.transactions.map(txid => {
                    promises.push(new Promise(function(resolve, reject){

                        web3.eth.getTransaction(txid, (error, tx) => {
                            if (tx.to) {
                                log.info(block.number, tx.hash, tx.from, tx.to, web3.fromWei(tx.value.toString(), 'ether'), blockNumber - tx.blockNumber + 1);
                                if (addresses[tx.to]) {
                                    tx.category = 'receive'
                                } else if (addresses[tx.from]) {
                                    tx.category = 'send'
                                }
                                if (tx.category) {
                                    var data = {
                                        account: tx.from,
                                        address: tx.to,
                                        category: tx.category,
                                        amount: web3.fromWei(tx.value.toString(), 'ether'),
                                        confirmations: (blockNumber - tx.blockNumber + 1),
                                        blockhash: block.hash,
                                        blockindex: tx.blockNumber,
                                        blocktime: block.timestamp,
                                        txid: tx.hash,
                                        time: block.timestamp,
                                        timereceived: block.timestamp,
                                        fee: web3.fromWei(tx.gasPrice * tx.gas, 'ether')
                                    }
                                    // console.log(data);
                                    localStorage.insert(data);
                                    if (addresses[tx.from]) {
                                        updateAmount(tx.from)
                                    }
                                    if (addresses[tx.to]) {
                                        updateAmount(tx.to)
                                    }
                                }
                            }
                            resolve()
                        })
                    }))
                })

                Promise.all(promises).then(() => {
                    writeCurrentBlock(++lastBlock)
                    sync()
                }, () => {
                    sync()
                }).catch(() => {
                    sync()
                })

            })

        } else {
            writeCurrentBlock(lastBlock - 3)
            setTimeout(sync, speed)
        }
    } catch (e) {
        setTimeout(sync, speed)
    }
}


setTimeout(() => {
    readCurrentBlock(sync)
}, 5000)

