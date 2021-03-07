const Discord = require('discord.js');
const Vote = require('../models/vote');

async function leaderboardCmd(message, command, input) {
  let { channel } = message;
  let results = await Vote.find().sort({ votes: 'desc' }).limit(5).exec();

  if (results.length > 1) {
    let embed = new Discord.MessageEmbed({
      title: '🔥 Daily Leaderboard',
      description: 'Vote for this server now with `$cpp vote`! Cast as many votes as you\'d like!'
    });

    for (let i = 0; i < results.length; i++) {
      let result = results[i];

      if (i === 0) {
        embed.addField(`#${i + 1} - ${result.name} 🍾 🎉`, `Votes: ${intToEmoji(result.votes)}`);
      } else {
        embed.addField(`#${i + 1} - ${result.name}`, `Votes: ${intToEmoji(result.votes)}`);
      }
    }

    await channel.send(embed);
  } else {
    await channel.send('Not enough votes are in yet');
  }
}

function intToEmoji(int) {
  let strInt = String(int);
  let out = '';

  for (let i = 0; i < strInt.length; i++) {
    out += digitToEmoji(parseInt(strInt[i]));
  }

  return out;
}

function digitToEmoji(num) {
  const map = [
    ':zero:', ':one:', ':two:', ':three:', ':four:',
    ':five:', ':six:', ':seven:', ':eight:', ':nine:'
  ];

  return map[num];
}

module.exports = leaderboardCmd;
