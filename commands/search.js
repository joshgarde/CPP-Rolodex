const Discord = require('discord.js');
const Server = require('../models/server');

async function searchCmd(message, command, input) {
  let { channel, client } = message;

  if (input.length > 0) {
    let start = Date.now();
    let results = await Server.fuzzySearch(input, { public: true });

    if (results.length === 1) {
      await channel.send(`Found 1 result`);
    } else if (results.length <= 5 || results.length === 0){
      await channel.send(`Found ${results.length} results`);
    } else {
      await channel.send(`Found ${results.length} results - here's the top 5`);
    }

    for (let i = 0; i < (results.length > 5 ? 5 : results.length); i++) {
      let result = results[i];
      let guild = await client.guilds.fetch(result._id);
      let defaultChannel = await client.channels.fetch(result.defaultChannel);
      let invite = await defaultChannel.createInvite();

      if (!guild.approximateMemberCount && !guild.approximatePresenceCount) {
        guild = await guild.fetch(); // Fail-safe incase values aren't properly filled
      }

      let embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(guild.name)
        .setDescription(result.description ? result.description : '- - -')
        .addField('Online', guild.approximatePresenceCount, true)
        .addField('Members', guild.approximateMemberCount, true)
        .setThumbnail(guild.iconURL({size: 512}))
        .setURL(invite.url);

      await channel.send(embed);
    }

    let stop = Date.now();
    await channel.send(`*Generated in ${(stop - start) / 1000} seconds*`);
  } else {
    await channel.send(
      '`$cpp search [query]`\n' +
      'Searches through the CPP Rolodex for servers that match'
    );
  }
}

module.exports = searchCmd;
