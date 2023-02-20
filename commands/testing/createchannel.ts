/**
 * Slash-command for creating channels
 * # Parameters
 * ## Name
 * * Name of new channel
 * ## Category
 * * Optional, category to place new channel inside of
 * @packageDocumentation
 */
import { SlashCommandBuilder, ChannelType, SlashCommandStringOption, ChatInputCommandInteraction, TextChannel, CategoryChannel, SlashCommandChannelOption } from 'discord.js';
import { createChannel } from '../../helpers/functions';
// Creates a new channel in the category the command was executed in, then locks permissions
module.exports = {
  data: new SlashCommandBuilder()
    .setName('createchannel')
    .setDescription('creates a new channel')
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('name')
        .setDescription('The name of the new channel')
        .setRequired(true))
    .addChannelOption((option: SlashCommandChannelOption) =>
      option.setName('category')
        .setDescription('Category for the new channel to be placed into')
        .addChannelTypes(ChannelType.GuildCategory))
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) return;
    const name = interaction.options.getString('name');
    if (!name) return;
    const category = interaction.options.getChannel('category') as CategoryChannel;
    const newChannel: TextChannel | undefined = await createChannel(interaction.guild, name);
    if (newChannel) {
      if (category) {
        await newChannel.setParent(category);
        await newChannel.lockPermissions();
      }
      await interaction.reply({ content: 'New channel created.', ephemeral: true });
    }
    else await interaction.reply({ content: 'Something went wrong creating a channel.', ephemeral: true });
  },
};