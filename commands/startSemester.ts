/**
 * TODO
 * @packageDocumentation
 */
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
// TODO
module.exports = {
  data: new SlashCommandBuilder()
    .setName('startsemester')
    .setDescription('Archive old courses, initialize new ones, transfer over student roles.')
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    // Loop over each course, archive it, save that data to one file, then loop over each new course
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    interaction.editReply(`Pong!\nTook ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
  },
};