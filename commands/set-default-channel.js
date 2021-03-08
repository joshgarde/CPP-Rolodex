const { adminOnly, textOnly } = require('../helpers');
const Server = require('../models/server');

async function setDefaultChannelCmd(message, command, input) {
  let { channel, guild } = message;

  await Server.findOneAndUpdate({_id: guild.id}, {
    name: guild.name,
    defaultChannel: channel.id
  });

  await channel.send(`Updated default invite channel: #${channel.name}`);
}

module.exports = textOnly(adminOnly(setDefaultChannelCmd));
