'use strict';
const Discord = require('discord.js');
const mongoose = require('mongoose');
const { scheduleJob } = require('node-schedule');
const Server = require('./models/server');
const Vote = require('./models/vote');
require('dotenv').config();

const commandMap = {
  'about': require('./commands/about'),
  'help': require('./commands/help'),
  'leaderboard': require('./commands/leaderboard'),
  'search': require('./commands/search'),
  'set-default-channel': require('./commands/set-default-channel'),
  'set-description': require('./commands/set-description'),
  'set-public': require('./commands/set-public'),
  'vote': require('./commands/vote')
};

const client = new Discord.Client();

async function processCommand(message, command, input) {
  if (commandMap[command]) {
    await commandMap[command](message, command, input);
  } else {
    await channel.send(`${command}: command not found.`)
  }
}

async function readyHandler() {
  let { readyAt, user } = client;

  await client.user.setPresence({ activity: { name: 'Use `$cpp help` for more info' }});
  scheduleJob('0 0 * * *', clearVotes); // Clear leaderboard daily

  console.log(` -- Ready at: ${readyAt.toLocaleString()}`);
  console.log(` -- Running as: ${user.username}#${user.discriminator}`);
  console.log(` -- Authorization URL: https://discord.com/api/oauth2/authorize?scope=bot&permissions=2113&client_id=${user.id}`);
}

async function guildCreateHandler(guild) {
  let server = new Server({
    _id: guild.id,
    name: guild.name
  });

  // Attempt to guess default invite channel
  if (guild.rulesChannelID) {
    server.defaultChannel = guild.rulesChannelID;
  } else if (guild.publicUpdatesChannelID) {
    server.defaultChannel = guild.publicUpdatesChannelID;
  } else {
    // Default to first text channel listed
    let channels = guild.channels.cache;
    server.defaultChannel = channels.find(channel => channel.type === 'text').id;
  }

  if (server.defaultChannel) {
    await server.save();
    console.log(`Successfully joined server: ${guild.name}; id: ${guild.id}`);
  } else {
    console.log(`Failed to join server: ${guild.name}; id: ${guild.id} - reason: NO_DEFAULT_CHANNEL`);
  }
}

async function guildDeleteHandler(guild) {
  await Server.deleteOne({_id: guild.id});
  console.log(`Deleted server: ${guild.name}; id: ${guild.id}`);
}

async function messageHandler(message) {
  if (message.author.id === client.user.id) return; // knockdown echo chambers

  let content = (/\$cpp (\S*) ?(.*$)/gi).exec(message.content);

  if (content) {
    let command = content[1].toLowerCase().trim();
    let input = content[2].trim();

    processCommand(message, command, input).catch((e) => {
      console.log(`[ERROR] ${e}`);
      message.channel.send('An unhandled error occurred - message josh®#7081 for assistance');
    });
  }
}

async function clearVotes() {
  await Vote.collection.drop();
}

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

mongoose.connect(process.env.DATABASE_URI, dbOptions).then(() => {
  client.on('ready', readyHandler);
  client.on('guildCreate', guildCreateHandler);
  client.on('guildDelete', guildDeleteHandler);
  client.on('message', messageHandler);

  client.login(process.env.BOT_TOKEN);
});
