const { adminOnly, textOnly } = require('../helpers');
const { Server } = require('../db/models');

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

    let server = await Server.update({
      name: guild.name,
      public: value
    }, {where: {id: guild.id}});

    await channel.send(`Public: \`${value ? 'Yes' : 'No'}\``);
  } else {
    await channel.send(
      '`$cpp set-public [true/false]`\n' +
      'Sets whether or not to include this server in search results. (Default: true)'
    );
  }
}

module.exports = textOnly(adminOnly(setPublicCmd));
