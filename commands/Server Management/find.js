module.exports = {
	help: ()=> "Finds all servers matching a certain name.",
	usage: ()=> [" [name] - Finds every server that has the input in the name"],
	execute: async (bot, msg, args)=>{
		var name = args.join(" ").toLowerCase();
		var servers = await bot.utils.findServers(bot, msg.guild.id, name);
		if(!servers || !servers[0]) return msg.channel.createMessage("No servers were found");

		var embeds = [];
		for(var i = 0; i < servers.length; i++) {
			var dat = servers[i].contact_id == undefined || servers[i].contact_id == "" ? "" : await bot.utils.verifyUsers(bot, servers[i].contact_id.split(" "));
			var contacts = dat.info ? dat.info.map(user => `${user.mention} (${user.username}#${user.discriminator})`).join("\n") : "(no contact provided)";

			embeds.push({embed: {
				title: (servers[i].name || "(unnamed)") + ` (server ${i+1}/${servers.length})`,
				description: servers[i].description || "(no description provided)",
				fields: [
					{name: "Contact", value: contacts},
					{name: "Link", value: servers[i].invite ? servers[i].invite : "(no link provided)"},
					{name: "Members", value: servers[i].guild ? servers[i].guild.memberCount : "(unavailable)"}
				],
				thumbnail: {
					url: servers[i].pic_url || ""
				},
				color: 3447003,
				footer: {
					text: `ID: ${servers[i].server_id} | This server ${servers[i].visibility ? "is" : "is not"} visible on the website`
				}
			}})
		}

		var message = await msg.channel.createMessage(embeds[0]);
		if(!bot.menus) bot.menus = {};
		bot.menus[message.id] = {
			user: msg.author.id,
			index: 0,
			data: embeds,
			timeout: setTimeout(()=> {
				if(!bot.menus[message.id]) return;
				try {
					message.removeReactions();
				} catch(e) {
					console.log(e);
				}
				delete bot.menus[message.id];
			}, 900000),
			execute: bot.utils.paginateEmbeds
		};
		
		["\u2b05", "\u27a1", "\u23f9"].forEach(r => message.addReaction(r));
	},
	alias: ['servers', 'server'],
	permissions: ["manageMessages"],
	guildOnly: true
}