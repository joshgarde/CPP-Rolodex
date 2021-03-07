const { textOnly } = require('../helpers');
const Vote = require('../models/vote');

async function voteCmd(message, command, input) {
  let { channel, guild } = message;

  await Vote.findOneAndUpdate({_id: guild.id}, {
    _id: guild.id,
    name: guild.name,
    $inc: { votes: 1 }
  }, { upsert: true, setDefaultsOnInsert: true });

  await message.react('✅');
}

module.exports = textOnly(voteCmd);
