const Discord = require('discord.js');
const { Server } = require('../db/models');

async function searchCmd(message, command, input) {
  let { channel, client } = message;

  if (input.length > 0) {
    let start = Date.now();
    let results = await Server.search(input)
    let sendQueue = [];

    for (let i = 0; i < results.length; i++) {
      try {
        let result = results[i];
        let name, online, members, iconURL, inviteURL;

        if (result.invite) {
          let invite = await client.fetchInvite(result.invite);
          name = invite.guild.name;
          iconURL = invite.guild.iconURL({size: 512});
          online = invite.presenceCount;
          members = invite.memberCount;
          inviteURL = invite.url;
        } else {
          let guild = await client.guilds.fetch(result.id);
          let defaultChannel = await client.channels.fetch(result.defaultChannel);
          let invite = await defaultChannel.createInvite();

          if (!guild.approximateMemberCount && !guild.approximatePresenceCount)
            guild = await guild.fetch();

          name = guild.name;
          iconURL = guild.iconURL({size: 512});
          online = guild.approximatePresenceCount;
          members = guild.approximateMemberCount;
          inviteURL = invite.url;
        }

        let embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(name)
          .setDescription(result.description ? result.description : '- - -')
          .addField('Online', online, true)
          .addField('Members', members, true)
          .setThumbnail(iconURL)
          .setURL(inviteURL);

        sendQueue.push(embed);
      } catch (err) {
        console.log(`[ERROR] ${JSON.stringify(err)}`);
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
