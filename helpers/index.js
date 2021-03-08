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

  findDefaultChannel(guild, user) {
    // Attempt to guess default invite channel
    if (guild.rulesChannelID) {
      return guild.rulesChannelID;
    } else if (guild.publicUpdatesChannelID) {
      return guild.publicUpdatesChannelID;
    } else {
      // Default to first text channel listed
      let channels = guild.channels.cache;
      let firstText = channels.find((channel) => {
        if (channel.type !== 'text') return false;

        let permissions = channel.permissionsFor(user);
        if (!permissions) return false;

        return permissions.has(Permissions.FLAGS.CREATE_INSTANT_INVITE);
      });

      if (firstText) {
        console.log(`${firstText.name}`);
        return firstText.id;
      } else {
        return null;
      }
    }
  }
}
