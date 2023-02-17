import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption, ColorResolvable } from 'discord.js';
import { OptionalRole } from '../helpers/role';
import { getListFromFile, saveListToFile, generateColor } from '../helpers/functions';
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
    .setDefaultMemberPermissions(0),
  async execute(interaction: ChatInputCommandInteraction) {
    const roleName = interaction.options.getString('name');
    const description = interaction.options.getString('description');
    const rolesList = getListFromFile('data/optroles.json') as OptionalRole[];
    const serverRoles = [];
    interaction.guild.roles.cache.forEach(r => {
      serverRoles.push(r.name);
    });
    for (const role of rolesList) {
      if (role.name === roleName) {
        // If our role is already in the list, just return an error message
        interaction.reply({ content: 'A course with that name already exists.', ephemeral: true });
        return;
      }
    }
    let color: ColorResolvable;
    let role = await interaction.guild.roles.cache.find(x => x.name === roleName);
    if (!role) {
      color = generateColor();
      while (await interaction.guild.roles.cache.find(x => x.hexColor === color)) {
        // Keep generating a new color until no role matches it
        color = generateColor();
      }
      role = await interaction.guild.roles.create({
        name: roleName,
        color: color,
      })
        .then(x => {
          return x;
        })
        .catch(x => {
          console.error('Something went wrong when creating role ' + x.name);
          return undefined;
        });
    }
    else {
      color = role.hexColor;
    }
    const newRole = new OptionalRole(
      roleName,
      role,
      description,
    );
    rolesList.push(newRole);
    saveListToFile(rolesList, 'data/optroles.json');
    interaction.reply({ content: 'Role added!', ephemeral: true });
  },
};