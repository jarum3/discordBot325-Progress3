import { REST, Routes } from 'discord.js';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as dotenv from 'dotenv';

function deployCommands(): void {
  /**
   * Deploys commands using the discord REST Api, and utilizing .env variables
   * @remarks
   * This function serves primarily as a standalone script
   */

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
  if (process.env.testing.toLowerCase() === 'true') {
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

  const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

  (async () => {
    try {
      console.log(`Started refreshing ${commands.length} application (/) commands.`);

      const data = await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands },
      ) as string[];

      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }
    catch (error) {
      console.error(error);
    }
  })();
}
deployCommands();