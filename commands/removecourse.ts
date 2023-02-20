/**
 * Slash-command to remove a course from the list, and delete its associated active role, and its veteran role if no users are found
 * Used when accidentally creating courses, or when creating the same course with new data
 * (Other circumstances should be handled as part of starting the semester)
 * # Menu
 * * Creates a StringSelectMenu  with courses listed that handles course removal,
 * with implementation described in the {@link events/selectmanagers/courseremove | Course remove event}
 * @packageDocumentation
 */
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CourseSelectMenu } from '../helpers/functions';
// Adds a course to the list of courses, with a role and veteran role attached
module.exports = {
  data: new SlashCommandBuilder()
    .setName('removecourse')
    .setDescription('Provides a dropdown to remove a course')
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    const row = await CourseSelectMenu('course-remove', false);
    if (row) await interaction.reply({ content: 'Please select which course you\'d like to remove:', components: [row], ephemeral: true });
    else await interaction.reply({ content: 'There are no courses defined currently.', ephemeral: true });
  },
};