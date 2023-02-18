/**
 * 
 * @packageDocumentation
 */
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { CourseSelectMenu } from '../../helpers/functions';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('createcoursecategory')
    .setDescription('Takes a course from a dropdown and turns it into a populated category')
    .setDefaultMemberPermissions(0),
  async execute(interaction: ChatInputCommandInteraction) {
    const row = await CourseSelectMenu('create-category', false);
    if (row) await interaction.reply({ content: 'Please select which course you\'d like to create a category for:', components: [row], ephemeral: true });
    else await interaction.reply({ content: 'There are no courses defined currently.', ephemeral: true })
  },
};