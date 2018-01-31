'use strict';

let localStorage = require('../lib/localStorage');

function listtransactions(rpc, res) {
    localStorage.getTransactions(rpc, ret => {
        let error = null;
        if (!ret) {
            error = 'new address error.';
        }
        res.send({id: rpc.id, result: ret, error: error})
    });
}

module.exports = listtransactions;
