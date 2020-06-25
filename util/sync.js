const cryptoRandomString = require('crypto-random-string');

exports.sync_message = (redis_client, discord_channel, id) => {
    const code = cryptoRandomString({length: 12, type: 'base64'});

    redis_client.get('discord.synccodes', (err, res) => {
        if(res === null) res = '{}';
        var codes = JSON.parse(res);
        codes[id] = {code: code, expires: Date.now() + 30 * 60 * 1000};
        redis_client.set('discord.synccodes', JSON.stringify(codes));
        discord_channel.send('Go in-game and type `/discord ' + code + '` to sync your account.\n'
        + 'This code expires in 30 minutes. Your previous codes are now invalid.');
    });

};