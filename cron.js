'use strict';

var CronJob = require('cron').CronJob;

let toMainWallet = require('./lib/toMainWallet');

// 每天定时同步子账户钱包，到主账户
// 秒 分 时 日 月 年
// 每天凌晨执行
new CronJob('0 */5 * * * *', function(){
    try {
        toMainWallet();
    } catch(e) {
    }
}, null, true);
