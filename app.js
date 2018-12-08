const Discord = require('discord.js');
const { prefix, token } = require('./config/config.json');

// Init Discord
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.login(token);

client.on('message', message => {
  // If the message either doesn't start with the prefix or was sent by a bot, exit early.
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Variables
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'ping') {
    message.channel.send('Pong.');
  } else if (command === 'server') {
    message.channel.send(
      `Server name: ${message.guild.name}\nTotal members: ${
        message.guild.memberCount
      }`
    );
  } else if (command === 'user-info') {
    message.channel.send(
      `Your username: ${message.author.username}\nYour ID: ${message.author.id}`
    );
  } else if (command === 'args-info') {
    if (!args.length) {
      return message.channel.send(
        `You didn't provide any arguments, ${message.author}!`
      );
    } else if (args[0] === 'foo') {
      return message.channel.send('bar');
    }
    message.channel.send(`First argument: ${args[0]}`);
  } else if (command === 'kick') {
    // Sanity check if no user mentioned
    if (!message.mentions.users.size) {
      return message.reply('you need to tag a user in order to kick them!');
    }
    // grab the "first" mentioned user from the message
    // this will return a `User` object, just like `message.author`
    const taggedUser = message.mentions.users.first();

    message.channel.send(`You wanted to kick: ${taggedUser.username}`);
  }
});
