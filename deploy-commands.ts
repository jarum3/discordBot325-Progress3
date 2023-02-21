/**
 * Deploys commands using the discord REST Api, and utilizing .env variables
 * @remarks This function serves primarily as a standalone script, not called by other modules.
 * @packageDocumentation
 */

/*
This module uses require and explicit any to handle event handlers,
in ways that are less intuitive using top-level imports
*/
/* eslint-disable @typescript-eslint/no-var-requires */
import { REST, Routes } from 'discord.js';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as dotenv from 'dotenv';

function deployCommands(): void {
  dotenv.config();
  const commands = [];
  const commandsPath = path.join(__dirname, 'commands'); // Grabbing command directory
  const currentFileExtension = '.' + __filename.split('.').slice(-1);
  // Grabbing all files ending in current file extension (.ts for typescript, .js for javascript)
  const commandFiles: string[] = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith(currentFileExtension));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Push each command data to the commands list as JSON
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    }
    else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
  let testing = false;
  if (process.env.testing) testing = process.env.testing.toLowerCase() === 'true';
  if (testing) {
    const testingPath = path.join(__dirname, 'commands/testing'); // Grabbing testing directory
    // Grabbing all files ending in current file extension (.ts for typescript, .js for javascript)
    const testingFiles = fs.readdirSync(testingPath).filter((file: string) => file.endsWith(currentFileExtension));

    for (const file of testingFiles) {
      const filePath = path.join(testingPath, file);
      const command = require(filePath);
      // Push each command data to the commands list as JSON
      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
      }
      else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }
  if (process.env.CLIENT_TOKEN) {

    const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

    (async () => {
      try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        if (process.env.CLIENT_ID != undefined) {
          const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
          ) as string[];

          console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
        else console.error('CLIENT_ID is not defined in .env');
      }
      catch (error) {
        console.error(error);
      }
    })();
  }
  else console.error('CLIENT_TOKEN is not defined in .env');
}
deployCommands();