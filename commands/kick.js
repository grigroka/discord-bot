'use strict';

module.exports = {
  name: 'kick',
  description: 'Pseudo-kick test command.',
  args: true,
  usage: '<@user>',
  execute(message) {
    // Sanity check if no user mentioned
    if (!message.mentions.users.size) {
      return message.reply('you need to tag a user in order to kick them!');
    }
    // grab the "first" mentioned user from the message
    // this will return a `User` object, just like `message.author`
    const taggedUser = message.mentions.users.first();

    message.channel.send(`You wanted to kick: ${taggedUser.username}`);
  }
};
