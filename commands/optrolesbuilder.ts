/**
 * Slash-command to generate a select menu towards users, to give themselves optional roles
 * # Menu
 * * Generates a StringSelectMenu with CustomId 'reaction-roles' that applies roles to interacted members,
 * with implementation defined in the {@link events/selectmanagers/reactionroles | Reaction roles event}
 * @packageDocumentation
 */
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { RoleSelectMenu } from '../helpers/functions';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('optrolesbuilder')
    .setDescription('Creates a dropdown menu in this channel for students to select optional roles')
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    const row = await RoleSelectMenu('reaction-roles', true);
    if (row) await interaction.reply({ content: 'Please select which roles you would like to add:', components: [row] });
    else await interaction.reply({ content: 'There are no optional roles defined currently.', ephemeral: true });
  },
};