const Discord = require('discord.js');
const { prefix, token } = require('./config/config.json');

// Init Discord
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.login(token);

client.on('message', message => {
  if (message.content === `${prefix}ping`) {
    message.channel.send('Pong.');
  } else if (message.content.startsWith(`${prefix}beep`)) {
    message.channel.send(`Boop. ${message}`);
  } else if (message.content === `${prefix}server`) {
    message.channel.send(
      `Server name: ${message.guild.name}\nTotal members: ${
        message.guild.memberCount
      }`
    );
  } else if (message.content === `${prefix}user-info`) {
    message.channel.send(
      `Your username: ${message.author.username}\nYour ID: ${message.author.id}`
    );
  }
});
