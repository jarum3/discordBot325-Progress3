/**
 * Slash-command for creating a category based on courses
 * # Menu
 * * StringSelectMenu populated with courses with CustomId 'create-category' defined in {@link events/selectmanagers/createcategory | Create category event}
 * @packageDocumentation
 */
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CourseSelectMenu } from '../../helpers/functions';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('createcoursecategory')
    .setDescription('Takes a course from a dropdown and turns it into a populated category')
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    const row = await CourseSelectMenu('create-category', false);
    if (row) await interaction.reply({ content: 'Please select which course you\'d like to create a category for:', components: [row], ephemeral: true });
    else await interaction.reply({ content: 'There are no courses defined currently.', ephemeral: true });
  },
};