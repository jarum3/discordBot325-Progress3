/**
 * Simple ping command that lists time to server, for checking that bot is running
 * @packageDocumentation
 */
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
// Pings, returns time pinged. A template for other commands.
module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    interaction.editReply(`Pong!\nTook ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
  },
};