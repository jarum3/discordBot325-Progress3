import { ChatInputCommandInteraction, SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, SelectMenuComponentOptionData } from 'discord.js';
import { CourseSelectMenu, RoleSelectMenu } from '../helpers/functions';
// Adds a course to the list of courses, with a role and veteran role attached
module.exports = {
  data: new SlashCommandBuilder()
    .setName('removecourse')
    .setDescription('Provides a dropdown to remove courses')
    .setDefaultMemberPermissions(0),
  async execute(interaction: ChatInputCommandInteraction) {
    const row = await CourseSelectMenu('course-remove', true);
    if (row) await interaction.reply({ content: 'Please select which courses you\'d like to remove:', components: [row], ephemeral: true });
    else await interaction.reply({ content: 'There are no courses defined currently.', ephemeral: true })
  },
};