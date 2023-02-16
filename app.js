// Dependencies
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, IntentsBitField } = require('discord.js');
const botIntents = new IntentsBitField();
// Declaring intents
botIntents.add(IntentsBitField.Flags.GuildMessages);
const client = new Client({ intents: botIntents }); // Creates client with intents in botIntents
client.commands = new Collection();
// Reading commands and adding them to collection

const commandsPath = path.join(__dirname, 'commands'); // Grabbing command directory
// Grabbing all files ending in .js
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Create a command for each file, using the command name and value
  // Making sure that data and execute sections are intact
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  }
  else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}


// Processing env string as boolean
if (process.env.testing.toLowerCase() === 'true') {
  const testingPath = path.join(__dirname, 'commands/testing'); // Grabbing tests directory
  const testingFiles = fs.readdirSync(testingPath).filter(file => file.endsWith('.js'));


  for (const file of testingFiles) {
    const filePath = path.join(testingPath, file);
    const command = require(filePath);
    // Create a command for each file, using the command name and value
    // Making sure that data and execute sections are intact
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    }
    else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) { // If the event only runs once, use once
    client.once(event.name, (...args) => event.execute(...args)); // Using rest and spread to pass all arguments
  }
  else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Last line
client.login(process.env.CLIENT_TOKEN);