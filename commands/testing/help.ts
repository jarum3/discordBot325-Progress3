/**
 * Simple ping command that lists time to server, for checking that bot is running
 * @packageDocumentation
 */
import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
// Pings, returns time pinged. A template for other commands.
module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Embeds with Pong!'),
  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle("Help")
        .setColor(0x0099FF);

    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, embeds: [embed] });
    interaction.reply(`Pong!\nTook ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
  },
};