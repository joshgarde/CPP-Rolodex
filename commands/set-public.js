const { adminOnly, textOnly } = require('../helpers');
const Server = require('../models/server');

async function setPublicCmd(message, command, input) {
  let { channel } = message;

  if (input.length > 0) {
    let guild = channel.guild;
    let value;

    input = input.toLowerCase();
    if (input === 'true' || input === 'yes' || input === 'y') {
      value = true;
    } else if (input === 'false' || input === 'no' || input === 'n') {
      value = false;
    } else {
      await channel.send(`Invalid value: ${input}`);
      return;
    }

    let server = await Server.findOneAndUpdate({_id: guild.id}, {
      name: guild.name,
      public: value
    }, { new: true });

    await channel.send(`Public: \`${server.public ? 'Yes' : 'No'}\``);
  } else {
    await channel.send(
      '`$cpp set-public [true/false]`\n' +
      'Sets whether or not to include this server in search results. (Default: true)'
    );
  }
}

module.exports = textOnly(adminOnly(setPublicCmd));
