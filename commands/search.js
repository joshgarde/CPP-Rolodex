const Discord = require('discord.js');
const Server = require('../models/server');

async function searchCmd(message, command, input) {
  let { channel, client } = message;

  if (input.length > 0) {
    let start = Date.now();
    let results = await Server.fuzzySearch(input, { public: true });
    let sendQueue = [];

    for (let i = 0; i < (results.length > 5 ? 5 : results.length); i++) {
      try {
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

        sendQueue.push(embed);
      } catch (err) {
        console.log(`[ERROR] ${err}`);
      }
    }

    if (sendQueue.length === 1) {
      sendQueue.splice(0, 0, 'Found 1 result');
    } else if (sendQueue.length <= 5 || sendQueue.length === 0){
      sendQueue.splice(0, 0, `Found ${sendQueue.length} results`);
    } else {
      sendQueue.splice(0, 0, `Found ${sendQueue.length} results - here's the top 5`);
    }

    let stop = Date.now();
    sendQueue.push(`*Generated in ${(stop - start) / 1000} seconds*`);

    for (let i = 0; i < sendQueue.length; i++) {
      await channel.send(sendQueue[i]);
    }
  } else {
    await channel.send(
      '`$cpp search [query]`\n' +
      'Searches through the CPP Rolodex for servers that match'
    );
  }
}

module.exports = searchCmd;
