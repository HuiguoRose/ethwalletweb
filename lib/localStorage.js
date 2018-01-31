'use strict';

let db = require('./db')
let log = require('./log')('localStorage');

function insert(data) {
    db.run("INSERT OR REPLACE INTO transactions (txid,account,address,category,amount,confirmations,blockhash,blockindex,blocktime,time,timereceived,fee) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        [data.txid
            , data.account
            , data.address
            , data.category
            , data.amount
            , data.confirmations
            , data.blockhash
            , data.blockindex
            , data.blocktime
            , data.time
            , data.timereceived
            , data.fee], (err, ret) => {
            if (err) {
                log.error('insert transactions ', JSON.stringify(data), err, ret);
            }
        });
}

function insertAccount(address) {
    db.run("INSERT OR REPLACE INTO accounts (address,amount) VALUES (?,?)",
        [address, 0], (err, ret) => {
            if (err) {
                log.error('insert accounts ', JSON.stringify(data), err, ret);
            } else {
                addresses[address] = true
            }
        });
}

function updateAccount(address, amount) {
    db.run("update accounts set amount = ? where address = ?",
        [amount, address], (err, ret) => {
            if (err) {
                log.error('update accounts ', address, amount, err, ret);
            }
        });
}

function getAmounts(callback) {
    db.get("SELECT SUM(amount) amount FROM accounts", [], (err, res) => {
        if (err) {
            log.error('getAmounts', err, res);
        }
        callback && callback(res.amount);
    });
}

function getAccounts(callback) {
    db.all("SELECT * FROM accounts", [], (err, res) => {
        if (err) {
            log.error('getAccounts', err, res);
        }
        callback && callback(res);
    });
}

function getTransactions(rpc, callback) {
    let size = rpc.params[1];
    let begin = rpc.params[2];
    db.all("SELECT a.* FROM transactions a, accounts b where a.address = b.address ORDER BY a.time limit ?,?", [begin, size], (err, res) => {
        if (err) {
            log.error('getTransactions ', err, ret);
        }
        callback && callback(res);
    });
}

function getTransaction(txid, callback) {
    db.get("SELECT * FROM transactions where txid = ?", [txid], (err, res) => {
        if (err) {
            log.error('getTransaction', err, ret);
        }
        callback && callback(res);
    });
}

function getAddresses() {
    return addresses
}

let addresses = {}
// cache exists addresses
getAccounts(res => {
    res.map(account => {
        addresses[account.address] = true
    })
})

module.exports = {
    insert: insert,
    getAddresses: getAddresses,
    getAmounts: getAmounts,
    getAccounts: getAccounts,
    insertAccount: insertAccount,
    updateAccount: updateAccount,
    getTransaction: getTransaction,
    getTransactions: getTransactions
}