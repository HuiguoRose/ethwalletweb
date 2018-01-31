'use strict';

var config = require('../config')
var Web3 = require('web3');
var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider(config.rpcUrl));

module.exports = web3
