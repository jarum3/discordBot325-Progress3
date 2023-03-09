/**
 * Event handler for any form of InteractionCreate, handles both select menu routing and command input routing
 * to distinct files.
 * @packageDocumentation
 */

/*
This module uses require and explicit any to handle event handlers,
in ways that are less intuitive using top-level imports
Or impossible without explicit any.
*/
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Events, Collection, BaseInteraction } from 'discord.js';

// Creating interface for client to access commands
declare module 'discord.js' {
  export interface Client {
    commands: Collection<unknown, any>;
  }
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
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