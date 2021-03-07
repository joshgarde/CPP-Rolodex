async function aboutCmd(message, command, input) {
  let { channel, client } = message;
  let user = client.user;

  await channel.send(
    `${user.username} is a directory service bot for CPP Discord Servers. It's `   +
    'goal is to make navigating the vast sea of decentralized CPP servers easier ' +
    'for students and make advertising/discovery easier for server operators.\n\n' +
    'Want to contribute? https://github.com/joshgarde/CPP-Rolodex\n\n'             +
    '- created by josh®#7081'
  );
}

module.exports = aboutCmd;
