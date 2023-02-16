const { SlashCommandBuilder } = require('discord.js');

// Pings, returns time pinged. A template for other commands.
module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    interaction.editReply(`Pong!\nTook ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
  },
};