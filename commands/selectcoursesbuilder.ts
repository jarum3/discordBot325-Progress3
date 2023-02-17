import { CourseRole } from './../helpers/role';
import { ChatInputCommandInteraction, SelectMenuComponentOptionData, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { getListFromFile } from 'helpers/functions';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('selectcoursesbuilder')
    .setDescription('Creates a dropdown menu in this channel for students to select their roles')
    .setDefaultMemberPermissions(0),
  async execute(interaction: ChatInputCommandInteraction) {
    const rolesList = getListFromFile('data/courses.json') as CourseRole[];
    if (rolesList.length === 0) {
      await interaction.reply({ content: 'There are no courses currently in the list.', ephemeral: true });
      return;
    }
    const options: SelectMenuComponentOptionData[] = [];
    rolesList.forEach((element: CourseRole) => options.push({ label: element.name, description: element.name, value: element.name }));
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(new StringSelectMenuBuilder()
      .setCustomId('reaction-courses')
      .setPlaceholder('Nothing selected')
      .setMinValues(1)
      .setMaxValues(options.length)
      .addOptions(options));
    await interaction.reply({ content: 'Please select which courses you are enrolled in for this semester:', components: [row] });
  },
};