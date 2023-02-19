import { Events, BaseInteraction } from 'discord.js';
import { getListFromFile, saveListToFile } from '../helpers/functions';
import { OptionalRole } from '../helpers/role';

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    if (!interaction.isStringSelectMenu()) return;
    if (!(interaction.customId === 'role-remove')) return;
    const rolesList = getListFromFile('data/optRoles.json') as OptionalRole[];
    const rolesSelected = interaction.values;
    const removedRoles: string[] = [];
    // Assign roles
    for (const selectedElement of rolesSelected) {
      for (const course of rolesList) {
        if (course.name != selectedElement) continue;
        const optRole = await interaction.guild.roles.fetch(course.role.id);
        // Deletes role fully
        if (optRole) interaction.guild.roles.delete(optRole, 'Deleted as part of Optional Role deletion');
        rolesList.splice(rolesList.indexOf(course), 1);
        removedRoles.push(course.name);
        saveListToFile(rolesList, 'data/optroles.json');
      }
    }
    await interaction.reply({ content: 'Roles removed: ' + removedRoles.join(', '), ephemeral: true });
  }
}