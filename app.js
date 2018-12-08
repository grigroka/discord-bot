const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config/config.json');

// Init Discord
const client = new Discord.Client();
client.login(token);

// Init Commands
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

// Execute Commands on message
client.on('message', message => {
  // If the message either doesn't start with the prefix or was sent by a bot, exit early.
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Set command arguments and command name
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  // If no such command name exit early.
  if (!client.commands.has(commandName)) return;

  // Set command
  const command = client.commands.get(commandName);

  // Check if command takes in args.
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${
        command.usage
      }\``;
    }
    return message.channel.send(reply);
  }

  // Get and execute command with given args.
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});
