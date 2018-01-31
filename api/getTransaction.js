'use strict';

let localStorage = require('../lib/localStorage');

function getTransaction(txid, callback) {
    localStorage.getTransaction(txid, ret => {
        ret = ret || {};
        ret.details = []
        callback && callback(ret)
    });

}

/**
 * 获取交易
 */
function gettransaction(rpc, res) {
    getTransaction(rpc.params[0], ret => {
        let error = null;
        if (!ret) {
            error = 'get transaction fails.';
        }
        res.send({id: rpc.id, result: ret, error: error})
    });
}

module.exports = gettransaction;
