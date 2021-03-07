async function helpCmd(message, command, input) {
  let { channel } = message;

  await channel.send(
    'User commands:\n\`\`\`' +
    '$cpp about          Displays bot information\n' +
    '$cpp help           Displays this help guide\n' +
    '$cpp leaderboard    Displays the daily server leaderboard\n' +
    '$cpp search         Searches the rolodex for matching servers\n' +
    '$cpp vote           Vote for this server on the leaderboard\n' +
    '\`\`\`\n' +
    'Admin commands:\n\`\`\`' +
    '$cpp set-default-channel    Set the default invite channel to the current channel\n' +
    '$cpp set-description        Set the description that shows up in search results\n' +
    '$cpp set-public             Set whether or not this server appears in search results\n' +
    '\`\`\`'
  );
}

module.exports = helpCmd;
