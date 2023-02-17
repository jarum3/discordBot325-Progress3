import { ColorResolvable } from 'discord.js';
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
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
    const funcs = require('../helpers/functions');
    const roleData = require('../helpers/role');
    const roleName = interaction.options.getString('name');
    const description = interaction.options.getString('description');
    const rolesList = funcs.getListFromFile('data/optroles.json');
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
      color = funcs.generateColor();
      while (await interaction.guild.roles.cache.find(x => x.hexColor === color)) {
        // Keep generating a new color until no role matches it
        color = funcs.generateColor();
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
    const newRole = new roleData.OptionalRole(
      roleName,
      role,
      description,
    );
    rolesList.push(newRole);
    funcs.saveListToFile(rolesList, 'data/optroles.json');
    interaction.reply({ content: 'Role added!', ephemeral: true });
  },
};