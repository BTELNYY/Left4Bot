module.exports = {
	name: 'unmute',
	description: 'Unmutes a player in-game and in Discord',
	usage: '<username/Discord tag/Discord id/uuid>',
	aliases: ['none'],
	example: 'unmute Captain_Sisko',
	args: true,
    
	guildOnly: true,
	staffOnly: true,
	async execute(message, args, depend) {

		const {
			config,
			discord_lib: Discord,
			log,
			sql_pool: pool,
			player_util,
			redis_client,
		} = depend;

		player_util.get_uuid(args[0], pool, log, (uuid) => {
			if(uuid === null) {
				message.channel.send(new Discord.MessageEmbed()
					.setColor('#E74C3C')
					.setDescription(`\n:x: **Could not find player by \`${args[0]}\`.`
                 + ' Please use a Minecraft username, Minecraft UUID, Discord tag, or Discord user id**'));    
			} else {
				player_util.get_player_info(uuid, pool, redis_client, log, (player_data) => {
					if(player_data === null) {
						message.channel.send(new Discord.MessageEmbed()
							.setColor('#E74C3C')
							.setDescription(`\n:x: **Error getting data for uuid \`${uuid}\`.`));
					} else {
						if(player_data['muted']) {
							redis_client.publish('minecraft.console.hub.in', 'unmute ' + uuid);
							message.channel.send(new Discord.MessageEmbed()
								.setColor(config.colour)
								.setDescription(`:white_check_mark: ** ${player_data['username']} has been unmuted.**`)
								.setTimestamp());
						} else {
							message.channel.send(new Discord.MessageEmbed()
								.setColor('#E74C3C')
								.setDescription(`\n:x: **Error: ${player_data['username']} is not muted.**`));    
						}
					}
				});
			}
		});
	}
};