const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('optrolesbuilder')
    .setDescription('Creates a dropdown menu in this channel for students to select optional roles')
    .setDefaultMemberPermissions(0),
  async execute(interaction) {
    const funcs = require('../helpers/functions');
    const rolesList = funcs.getListFromFile('data/optroles.json');
    if (rolesList.length === 0) {
      await interaction.reply({ content: 'There are no roles currently in the list.', ephemeral: true });
      return;
    }
    const options = [];
    rolesList.forEach(element => options.push({ label: element.name, description: element.description, value: element.name }));
    const row = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder()
      .setCustomId('reaction-roles')
      .setPlaceholder('Nothing selected')
      .setMinValues(1)
      .setMaxValues(options.length) // Registers as a multi-choice menu when more than 1 role is available
      .addOptions(options));
    await interaction.reply({ content: 'Please select which roles you would like to add:', components: [row] });
  },
};