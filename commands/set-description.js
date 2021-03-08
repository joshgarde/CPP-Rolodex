const { adminOnly, textOnly } = require('../helpers');
const Server = require('../models/server');

async function setDescriptionCmd(message, command, input) {
  let { channel } = message;

  if (input.length > 0) {
    if (input.length > 140) {
      await channel.send('Description text is too long - 140 characters max');
      return;
    }

    let guild = channel.guild;

    let server = await Server.findOneAndUpdate({_id: guild.id}, {
      name: guild.name,
      description: input
    }, { new: true });

    await channel.send(`Updated description:\n> ${server.description}`);
  } else {
    await channel.send(
      '`$cpp set-description [Server Description Text]`\n' +
      'Sets the description that will be displayed along-side your server in search results. Max: 140 characters (Default: \'\')'
    );
  }
}

module.exports = textOnly(adminOnly(setDescriptionCmd));
