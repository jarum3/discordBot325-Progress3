/**
 * Slash command for creating categories
 * # Parameters
 * ## Name
 * * Name of category
 * ## Role
 * * Role to permissions-lock viewing category to
 * @packageDocumentation
 */
import { SlashCommandStringOption, SlashCommandBuilder, SlashCommandRoleOption, ChatInputCommandInteraction, Role } from 'discord.js';
import { createCategory } from '../../helpers/functions';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createcategory')
    .setDescription('Creates a new category')
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('name')
        .setDescription('The Name of the category')
        .setRequired(true))
    .addRoleOption((option: SlashCommandRoleOption) =>
      option.setName('role')
        .setDescription('Role to restrict category to')
        .setRequired(false))
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;
    const name = interaction.options.getString('name');
    if (!name) return;
    const role = interaction.options.getRole('role') as Role;
    await createCategory(name, interaction.guild.channels, role);
    await interaction.reply({ content: 'Category created', ephemeral: true });
  },
};