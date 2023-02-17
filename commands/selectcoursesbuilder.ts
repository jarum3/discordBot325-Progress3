import { ChatInputCommandInteraction, SelectMenuComponentOptionData, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { CourseRole } from '../helpers/role';
import { CourseSelectMenu, getListFromFile } from '../helpers/functions';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('selectcoursesbuilder')
    .setDescription('Creates a dropdown menu in this channel for students to select their roles')
    .setDefaultMemberPermissions(0),
  async execute(interaction: ChatInputCommandInteraction) {
    const row = await CourseSelectMenu('reaction-courses', true);
    if (row) await interaction.reply({ content: 'Please select which courses you are enrolled in for this semester:', components: [row] });
    else await interaction.reply({ content: 'There are no courses defined currently.', ephemeral: true })
  },
};