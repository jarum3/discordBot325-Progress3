import { ChatInputCommandInteraction, Events, Collection, BaseInteraction, RoleManager, GuildMemberRoleManager } from 'discord.js';
import { OptionalRole, CourseRole } from '../helpers/role';
import { getListFromFile, saveListToFile } from '../helpers/functions';
// Creating interface for client to access commands
declare module 'discord.js' {
  export interface Client {
    commands: Collection<unknown, any>
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