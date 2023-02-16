const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('selectcoursesbuilder')
    .setDescription('Creates a dropdown menu in this channel for students to select their roles')
    .setDefaultMemberPermissions(0),
  async execute(interaction) {
    const funcs = require('../helpers/functions');
    const rolesList = funcs.getListFromFile('data/courses.json');
    if (rolesList.length === 0) {
      await interaction.reply({ content: 'There are no courses currently in the list.', ephemeral: true });
      return;
    }
    const options = [];
    rolesList.forEach(element => options.push({ label: element.name, description: element.name, value: element.name }));
    const row = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder()
      .setCustomId('reaction-courses')
      .setPlaceholder('Nothing selected')
      .setMinValues(1)
      .setMaxValues(options.length)
      .addOptions(options));
    await interaction.reply({ content: 'Please select which courses you are enrolled in for this semester:', components: [row] });
  },
};