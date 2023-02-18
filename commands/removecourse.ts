/**
 *
 * @packageDocumentation
 */
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CourseSelectMenu } from '../helpers/functions';
// Adds a course to the list of courses, with a role and veteran role attached
module.exports = {
  data: new SlashCommandBuilder()
    .setName('removecourse')
    .setDescription('Provides a dropdown to remove a course')
    .setDefaultMemberPermissions(0),
  async execute(interaction: ChatInputCommandInteraction) {
    const row = await CourseSelectMenu('course-remove', false);
    if (row) await interaction.reply({ content: 'Please select which course you\'d like to remove:', components: [row], ephemeral: true });
    else await interaction.reply({ content: 'There are no courses defined currently.', ephemeral: true })
  },
};