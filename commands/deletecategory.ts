/**
 * Slash-command to delete a category in its entirety, with each channel that lists the category as a parent
 * # Parameters
 * ## Category
 * * CategoryChannel to delete, filtered down to category channels using .addChannelTypes
 * @packageDocumentation
 */
import { CategoryChannel } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType } from 'discord.js';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('deletecategory')
    .setDescription('Takes a category from a dropdown and deletes it and all its children')
    .addChannelOption(option =>
      option.setName('category')
        .setDescription('The category to delete')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true))
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    const category: CategoryChannel = interaction.options.getChannel('category') as CategoryChannel;
    category.children.cache.forEach(channel => { channel.delete('Deleted as part of category deletion'); });
    category.delete();
    interaction.editReply({ content: 'Deleted!' });
  },
};