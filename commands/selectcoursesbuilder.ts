/**
 * Slash-command to generate a select menu towards users, to give themselves roles related to courses
 * they're enrolled in.
 * # Menu
 * * Creates a stringSelectMenu with CustomId 'reaction-courses',
 * with implementation defined in the {@link events/selectmanagers/reactioncourses | Course reaction handler}
 * @packageDocumentation
 */
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { CourseSelectMenu } from '../helpers/functions';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('selectcoursesbuilder')
    .setDescription('Creates a dropdown menu in this channel for students to select their roles')
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    const row = await CourseSelectMenu('reaction-courses', true);
    if (row) await interaction.reply({ content: 'Please select which courses you are enrolled in for this semester:', components: [row] });
    else await interaction.reply({ content: 'There are no courses defined currently.', ephemeral: true });
  },
};