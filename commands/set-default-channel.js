const { adminOnly, textOnly } = require('../helpers');
const Server = require('../models/server');

async function setDefaultChannelCmd(message, command, input) {
  let { channel, guild } = message;

  let server = await Server.findOneAndUpdate({_id: guild.id}, {
    _id: guild.id,
    name: guild.name,
    defaultChannel: channel.id
  }, { upsert: true, setDefaultsOnInsert: true });

  await channel.send(`Updated default invite channel: #${channel.name}`);
}

module.exports = textOnly(adminOnly(setDefaultChannelCmd));
