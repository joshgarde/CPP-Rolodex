const Discord = require('discord.js');
const { Permissions } = Discord;

module.exports = {
  adminOnly(next) {
    return async (message, command, input) => {
      if (message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
        await next(message, command, input);
      } else {
        let { channel } = message;
        await channel.send('You\'re not authorized to do that - `Manage Server` permission required');
      }
    }
  },

  textOnly(next) {
    return async (message, command, input) => {
      if (message.channel.type === 'text') {
        await next(message, command, input);
      } else {
        let { channel } = message;
        await channel.send('This command only works on servers');
      }
    }
  },

  findDefaultChannel(guild) {
    // Attempt to guess default invite channel
    if (guild.rulesChannelID) {
      return guild.rulesChannelID;
    } else if (guild.publicUpdatesChannelID) {
      return guild.publicUpdatesChannelID;
    } else {
      // Default to first text channel listed
      let channels = guild.channels.cache;
      return channels.find(channel => channel.type === 'text').id;
    }
  }
}
