/**
 * Slash-command to add an optional role to the list.
 * Creates a new role always, with no members
 * # Parameters
 * ## Name
 * * Name for the role to be created, displayed to students
 * ## Description
 * * Description of the role, displayed to students
 * @packageDocumentation
 */
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption, ColorResolvable } from 'discord.js';
import { OptionalRole } from '../helpers/role';
import { getListFromFile, saveListToFile, generateColor, createRole } from '../helpers/functions';
// Adds a course to the list of courses, with a role and veteran role attached
module.exports = {
  data: new SlashCommandBuilder()
    .setName('addoptrole')
    .setDescription('Adds a role to the list of roles')
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('name')
        .setDescription('Role name')
        .setRequired(true))
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('description')
        .setDescription('Role description')
        .setRequired(true))
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply('This command is only valid in guilds.');
      return;
    }
    await interaction.deferReply({ ephemeral: true });
    const roleName = interaction.options.getString('name');
    const description = interaction.options.getString('description');
    if (!(roleName && description)) return;
    const rolesList = getListFromFile('data/optroles.json') as OptionalRole[];
    const serverRoles = [];
    interaction.guild.roles.cache.forEach(r => {
      serverRoles.push(r.name);
    });
    for (const role of rolesList) {
      if (role.name === roleName) {
        // If our role is already in the list, just return an error message
        interaction.editReply({ content: 'A role with that name already exists.' });
        return;
      }
    }
    let color: ColorResolvable;
    let role = interaction.guild.roles.cache.find(x => x.name.toLowerCase() === roleName.toLowerCase());
    if (!role) {
      color = generateColor();
      while (interaction.guild.roles.cache.find(x => x.hexColor as ColorResolvable === color)) {
        // Keep generating a new color until no role matches it
        color = generateColor();
      }
      role = await createRole(interaction.guild, roleName, color);
      if (!role) return;
    }
    else {
      color = role.hexColor as ColorResolvable;
    }
    const newRole = new OptionalRole(
      roleName,
      role,
      description,
    );
    rolesList.push(newRole);
    saveListToFile(rolesList, 'data/optroles.json');
    interaction.editReply({ content: 'Role added!' });
  },
};