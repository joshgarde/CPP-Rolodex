const { findDefaultChannel } = require('../helpers');
const { Server } = require('../db/models');

function ensureGuilds(client) {
  return async function _ensureGuilds() {
    let guilds = client.guilds.cache.array();

    for (let i = 0; i < guilds.length; i++) {
      let guild = guilds[i];
      let server = await Server.findOne({where: {id: guild.id}});

      if (!server) {
        server = new Server({
          id: guild.id,
          name: guild.name,
          defaultChannel: findDefaultChannel(guild, client.user)
        });

        await server.save();
      } else {
        server.name = guild.name;
        await server.save();
      }
    }
  }
}

function verifyGuilds(client) {
  return async function _verifyGuilds() {
    let servers = await Server.findAll();

    for (let i = 0; i < servers.length; i++) {
      let server = servers[i];

      if (server.invite) {
        try {
          await client.fetchInvite(server.invite);
        } catch (err) {
          if (err.code && err.code === 10006) { // Invalid invite
            await server.destroy(); // Delete from db
          }
        }
      } else {
        if (!client.guilds.cache.has(server.id)) {
          // Server likely kicked bot
          await server.destroy(); // Delete from db
        }
      }

    }
  }
}

async function clearVotes() {
  await Vote.collection.drop();
}

module.exports = { ensureGuilds, verifyGuilds, clearVotes };
