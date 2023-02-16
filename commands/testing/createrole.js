const { SlashCommandBuilder } = require('discord.js');
const funcs = require('../../helpers/functions');

// Creates a new role with a given name and color
module.exports = {
  data: new SlashCommandBuilder()
    .setName('createrole')
    .setDescription('Creates a new role')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the role'))
    .addStringOption(option =>
      option.setName('color')
        .setDescription('Hexcode of the desired color'))
    .setDefaultMemberPermissions(0),

  async execute(interaction) {
    const name = interaction.options.getString('name');
    const color = interaction.options.getString('color');
    // Create a new role
    if (funcs.isColor(color)) {
      funcs.createRole(interaction.guild, name, color);
      await interaction.reply('New role created!');
    }
    else {
      await interaction.reply('That color code is invalid.');
    }
  },
};