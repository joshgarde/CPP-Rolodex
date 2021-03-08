const { findDefaultChannel } = require('../helpers');
const Server = require('../models/server');
const Vote = require('../models/vote');

function verifyGuilds(client) {
  return async function _verifyGuilds() {
    let guilds = client.guilds.cache.array();

    for (let i = 0; i < guilds.length; i++) {
      let guild = guilds[i];
      let server = await Server.findOne({_id: guild.id});

      if (!server) {
        server = new Server({
          _id: guild.id,
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

async function clearVotes() {
  await Vote.collection.drop();
}

module.exports = { verifyGuilds, clearVotes };
