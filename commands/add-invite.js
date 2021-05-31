'use strict';
const { Server } = require('../db/models');

const OWNER_ID = process.env.OWNER

async function addInviteCmd(message, command, input) {
  let { channel, client } = message;
  let user = message.author;

  if (user.id != OWNER_ID) {
    await channel.send('Contact @josh®#7081 to add a server');
    return;
  }

  let inviteCode = /^((https:\/\/)?discord.gg\/)?(.{7,20})/.exec(input);
  if (!inviteCode || !inviteCode[3]) {
    await channel.send(`Invalid invite code`);
    return;
  }

  try {
    let invite = await client.fetchInvite(inviteCode[3]);
    let server = new Server({
      id: invite.guild.id,
      name: invite.guild.name,
      invite: invite.code,
      public: true
    });
    await server.save();

    await channel.send(`Added server: ${invite.guild.name}`);
  } catch (err) {
    await channel.send(`Failed to add server. Error: ${err}`);
  }
}

module.exports = addInviteCmd;
