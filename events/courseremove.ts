import { Events, BaseInteraction } from 'discord.js';
import { getListFromFile, saveListToFile } from '../helpers/functions';
import { CourseRole } from '../helpers/role';

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    // TODO add handling for joint courses
    if (!interaction.isStringSelectMenu()) return;
    if (!(interaction.customId === 'course-remove')) return;
    const rolesList = getListFromFile('data/courses.json') as CourseRole[];
    const rolesSelected = interaction.values;
    const removedRoles: string[] = [];
    // Assign roles in a loop, in case we want to make this a multi-select later.
    for (const selectedElement of rolesSelected) {
      for (const course of rolesList) {
        if (course.name != selectedElement) continue;
        const courseRole = course.role;
        const veteranRole = course.veteranRole;
        // Deletes roles if their members are empty
        const serverRole = await interaction.guild.roles.fetch(courseRole.id)
        const serverVeteranRole = await interaction.guild.roles.fetch(veteranRole.id);
        if (serverRole) serverRole.delete('Deleted as part of course deletion');
        if (serverVeteranRole && serverVeteranRole.members.size === 0) serverVeteranRole.delete('Deleted as part of course deletion');
        rolesList.splice(rolesList.indexOf(course), 1);
        removedRoles.push(course.name);
        saveListToFile(rolesList, 'data/courses.json');
      }
    }
    await interaction.update({ content: 'Course removed: ' + removedRoles.join(', '), components: [] });
  }
}