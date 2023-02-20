/**
 * Event handler for any form of InteractionCreate, handles both select menu routing and command input routing
 * to distinct files.
 * @packageDocumentation
 */
import { Events, Collection, BaseInteraction } from 'discord.js';
import * as path from 'node:path';
import * as fs from 'node:fs';
// Creating interface for client to access commands
declare module 'discord.js' {
  export interface Client {
    commands: Collection<unknown, any>
  }
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    if (interaction.isAnySelectMenu) {
      const selectPath = path.join(__dirname, 'selectmanagers');
      const currentFileExtension = '.' + __filename.split('.').slice(-1);
      const eventFiles = fs.readdirSync(selectPath).filter((file: string) => file.endsWith(currentFileExtension));

      for (const file of eventFiles) {
        const filePath = path.join(selectPath, file);
        const event = require(filePath);
        if (event.once) { // If the event only runs once, use once
          interaction.client.once(event.name, (...args: any) => event.execute(...args)); // Using rest and spread to pass all arguments
        }
        else {
          interaction.client.on(event.name, (...args: any) => event.execute(...args));
        }
      }
    }
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName); // Set command equal to the object in the command file.
      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`); // Print out an error if no command was found
        return;
      }
      try {
        await command.execute(interaction); // Run the execute block of the command
      }
      catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  },
};