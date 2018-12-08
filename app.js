const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('.');

// Init Discord
const client = new Discord.Client();
client.login(token);
// Init cooldowns
const cooldowns = new Discord.Collection();

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

  // Set command by its name or aliases, if no command - exit early.
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.alliases && cmd.alliases.includes(commandName)
    );
  if (!command) return;

  // Check if Guild only command.
  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply("I can't execute that command inside DMs!");
  }

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

  // Check if cooldowns Collection has the command set in it yet. If not - add.
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  // If cooldown already set - inform user of remaining time
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  // Set user timestamp.
  timestamps.set(message.author.id, now);
  // Auto delete after cooldown
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Get and execute command with given args.
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});
