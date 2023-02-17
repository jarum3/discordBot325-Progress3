import { SlashCommandBuilder, ChatInputCommandInteraction, SlashCommandStringOption, Role, ColorResolvable } from 'discord.js';
import { isColor } from '../../helpers/functions';
// Creates a new role with a given name and color
module.exports = {
  data: new SlashCommandBuilder()
    .setName('createrole')
    .setDescription('Creates a new role')
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('name')
        .setDescription('The name of the role'))
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('color')
        .setDescription('Hexcode of the desired color'))
    .setDefaultMemberPermissions(0),

  async execute(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString('name');
    const color = interaction.options.getString('color');
    // Create a new role
    if (isColor(color)) {
      await interaction.guild.roles.create({
        name: name,
        color: color as ColorResolvable,
      })
        .then(x => {
          return x;
        })
        .catch(x => {
          console.error('Something went wrong when creating role ' + x.name);
          return undefined;
        });
      await interaction.reply('New role created!');
    }
    else {
      await interaction.reply('That color code is invalid.');
    }
  },
};