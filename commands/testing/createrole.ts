/**
 * Slash-command that creates a new role in the guild its executed in, with given name and color
 * # Parameters
 * ## Name
 * * Name for new role
 * ## Color
 * * ColorResolvable hex code applied to new role (Ex. #123abc,  #ffffff, #abc)
 * @packageDocumentation
 */
import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandStringOption, ColorResolvable } from 'discord.js';
import { createRole, generateColor, isColor } from '../../helpers/functions';
// Creates a new role with a given name and color
module.exports = {
  data: new SlashCommandBuilder()
    .setName('createrole')
    .setDescription('Creates a new role')
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('name')
        .setDescription('The name of the role')
        .setRequired(true))
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('color')
        .setDescription('Hexcode of the desired color')
        .setRequired(false))
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;
    const name = interaction.options.getString('name');
    if (!name) return;
    const color = interaction.options.getString('color');
    // Create a new role
    if (color) {
      if (isColor(color)) {
        const role = await createRole(interaction.guild, name, color as ColorResolvable);
        if (role) await interaction.reply('New role created!');
        else await interaction.reply('Something went wrong while creating the role.');
      }
      else await interaction.reply('That color code is invalid.');
    }
    else {
      const role = await createRole(interaction.guild, name, generateColor());
      if (role) await interaction.reply('New role created!');
      else await interaction.reply('Something went wrong while creating the role.');
    }
  },
};