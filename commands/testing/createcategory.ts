import { SlashCommandStringOption, SlashCommandBuilder, ChannelType, PermissionsBitField, OverwriteType, SlashCommandRoleOption, ChatInputCommandInteraction, Role } from "discord.js";
import { createCategory } from "../../helpers/functions";
// Creates a new category, at the bottom, locked to the given role.
module.exports = {
  data: new SlashCommandBuilder()
    .setName('createcategory')
    .setDescription('Creates a new category')
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('name')
        .setDescription('The Name of the category'))
    .addRoleOption((option: SlashCommandRoleOption) =>
      option.setName('role')
        .setDescription('Role to restrict category to'))
    .setDefaultMemberPermissions(0),

  async execute(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString('name');
    const role = interaction.options.getRole('role') as Role;
    const category = await createCategory(name, role);
    await interaction.reply({ content: 'Category created', ephemeral: true });
  },
};