/**
 *
 * @packageDocumentation
 */
import { RoleSelectMenu } from '../helpers/functions';
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
// Adds a course to the list of courses, with a role and veteran role attached
module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeoptrole')
    .setDescription('Provides a dropdown to remove optional roles')
    .setDefaultMemberPermissions(0),
  async execute(interaction: ChatInputCommandInteraction) {
    const row = await RoleSelectMenu('role-remove', false);
    if (row) await interaction.reply({ content: 'Please select which roles you\'d like to remove:', components: [row], ephemeral: true });
    else await interaction.reply({ content: 'There are no optional roles defined currently.', ephemeral: true })
  },
};