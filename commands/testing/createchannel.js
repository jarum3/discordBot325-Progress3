const { SlashCommandBuilder, ChannelType } = require('discord.js');

// Creates a new channel in the category the command was executed in, then locks permissions
module.exports = {
  data: new SlashCommandBuilder()
    .setName('createchannel')
    .setDescription('creates a new channel')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the new channel'))
    .setDefaultMemberPermissions(0),
  async execute(interaction) {
    const name = interaction.options.getString('name');
    const createdChannel = await interaction.guild.channels.create({
      name: name,
      type: ChannelType.GuildText,
    })
      .then(channel => console.log('Created channel: ' + channel.name))
      .catch(channel => console.error('Error creating channel: ' + channel.name));
    createdChannel.setParent(interaction.channel.parent);
    createdChannel.lockPermissions();

    await interaction.reply('New channel created.');
  },
};