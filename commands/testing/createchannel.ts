import { SlashCommandBuilder, ChannelType, SlashCommandStringOption, ChatInputCommandInteraction, TextChannel, CategoryChannel } from 'discord.js';

// Creates a new channel in the category the command was executed in, then locks permissions
module.exports = {
  data: new SlashCommandBuilder()
    .setName('createchannel')
    .setDescription('creates a new channel')
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('name')
        .setDescription('The name of the new channel'))
    .setDefaultMemberPermissions(0),
  async execute(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString('name');
    const createdChannel: TextChannel | undefined = await interaction.guild.channels.create({
      name: name,
      type: ChannelType.GuildText,
    })
      .then(channel => {
        console.log('Created channel: ' + channel.name);
        return channel;
      })
      .catch(channel => {
        console.log('Error creating channel: ' + channel.name);
        return undefined;
      });
    if (createdChannel) {
      createdChannel.setParent(interaction.channel.parent as CategoryChannel);
      createdChannel.lockPermissions();

      await interaction.reply('New channel created.');
    }
    else await interaction.reply('Something went wrong creating a channel.');
  },
};