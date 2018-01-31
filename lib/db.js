'use strict';

let sqlite3 = require('sqlite3');
var log = require('./log')('db');
var db = new sqlite3.Database('db.dat');

function init() {
    // transactions
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
    txid TEXT PRIMARY KEY,
    account TEXT,
    address TEXT,
    category TEXT,
    amount TEXT,
    confirmations TEXT,
    blockhash TEXT,
    blockindex TEXT,
    blocktime TEXT,
    time TEXT,
    timereceived TEXT,
    fee TEXT
  )`, function (err) {
        if (err) {
            log.error('CREATE transactions TABLE ', err);
        }
    });

    // accounts
    db.run(`CREATE TABLE IF NOT EXISTS accounts (
    address TEXT PRIMARY KEY,
    amount TEXT
  )`, function (err) {
        if (err) {
            console.error('CREATE transactions TABLE ', err);
        }
    });
}

db.serialize(() => {
    init();
})

module.exports = db;
