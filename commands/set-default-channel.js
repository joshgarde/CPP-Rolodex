const { Permissions } = require('discord.js');
const { adminOnly, textOnly } = require('../helpers');
const Server = require('../models/server');

async function setDefaultChannelCmd(message, command, input) {
  let { channel, guild } = message;
  let newChannel = channel;
  let suppliedId = /<#(.*?)>/.exec(input);

  if (suppliedId) {
    let suppliedChannel = guild.channels.resolve(suppliedId[1]);
    if (!suppliedChannel) {
      await channel.send(`Invalid channel provided`);
      return;
    }

    let permissions = suppliedChannel.permissionsFor(message.client.user);
    if (!permissions) {
      await channel.send(`No permissions were found for that channel`);
      return;
    }

    if (!permissions.has(Permissions.FLAGS.CREATE_INSTANT_INVITE)) {
      await channel.send(`\`Create Instant Invite\` permission required`);
      return;
    }

    newChannel = suppliedChannel;
  }

  await Server.findOneAndUpdate({_id: guild.id}, {
    name: guild.name,
    defaultChannel: newChannel.id
  });

  await channel.send(`Updated default invite channel: #${newChannel.name}`);
}

module.exports = textOnly(adminOnly(setDefaultChannelCmd));
