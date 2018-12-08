'use strict';

module.exports = {
  name: 'avatar',
  description: 'Show Users or Mentioned avatar.',
  args: true,
  usage: '<@user> ...',
  execute(message) {
    const avatarList = message.mentions.users.map(user => {
      return `${user.username}'s avatar: ${user.displayAvatarURL}`;
    });

    // send the entire array of strings as a message
    // by default, discord.js will `.join()` the array with `\n`
    message.channel.send(avatarList);
  }
};
