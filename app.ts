/**
 * Main starting point for application, utilizes .env, scans command directories and event directories, and executes bot.
 * @packageDocumentation
 */

/*
This module uses require and explicit any to handle event handlers,
in ways that are less intuitive using top-level imports
*/
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Dependencies
import * as path from 'node:path';
import * as fs from 'node:fs';
import { Client, Collection, IntentsBitField } from 'discord.js';
import * as dotenv from 'dotenv';
import * as events from 'node:events';
dotenv.config();
declare module 'discord.js' {

  // We're intentionally shadowing client to allow for use of the commands collection
  // eslint-disable-next-line no-shadow
  export interface Client {
    commands: Collection<unknown, any>;
  }
}
const botIntents = new IntentsBitField();
// Declaring intents
botIntents.add([
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.Guilds,
]);
const client = new Client({ intents: botIntents }); // Creates client with intents in botIntents
client.commands = new Collection();
// Reading commands and adding them to collection

const commandsPath = path.join(__dirname, 'commands'); // Grabbing command directory
const currentFileExtension = '.' + __filename.split('.').slice(-1);
// Grabbing all files ending in current file extension (.ts for typescript, .js for javascript)
const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith(currentFileExtension));

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
let testing = false;
if (process.env.testing) testing = process.env.testing.toLowerCase() === 'true';
if (testing) {
  const testingPath = path.join(__dirname, 'commands/testing'); // Grabbing tests directory
  const testingFiles = fs.readdirSync(testingPath).filter((file: string) => file.endsWith(currentFileExtension));
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
let eventFiles = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith(currentFileExtension));
/**
 * Maximum for event listeners is 25, if more listeners are needed, please edit this line when those are added.
 */
events.setMaxListeners(25);
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) { // If the event only runs once, use once
    client.once(event.name, (...args: any) => event.execute(...args)); // Using rest and spread to pass all arguments
  }
  else {
    client.on(event.name, (...args: any) => event.execute(...args));
  }
}
const selectPath = path.join(__dirname, 'events/selectmanagers');
eventFiles = fs.readdirSync(selectPath).filter((file: string) => file.endsWith(currentFileExtension));

for (const file of eventFiles) {
  const filePath = path.join(selectPath, file);
  const event = require(filePath);
  if (event.once) { // If the event only runs once, use once
    client.once(event.name, (...args: any) => event.execute(...args)); // Using rest and spread to pass all arguments
  }
  else {
    client.on(event.name, (...args: any) => event.execute(...args));
  }
}

// Last line, if code runs after this, the bot won't know about it. Errors if client_token is invalid,
// but that's expected.
client.login(process.env.CLIENT_TOKEN);
