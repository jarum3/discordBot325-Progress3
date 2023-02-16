const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
// Adds a course to the list of courses, with a role and veteran role attached
module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeoptrole')
    .setDescription('Provides a dropdown to remove optional roles')
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
      .setCustomId('remove-roles')
      .setPlaceholder('Nothing selected')
      .setMinValues(1)
      .setMaxValues(options.length)
      .addOptions(options));
    await interaction.reply({ content: 'Please select which roles you\'d like to remove:', components: [row], ephemeral: true });
  },
};