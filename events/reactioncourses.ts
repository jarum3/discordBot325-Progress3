import { Events, BaseInteraction, GuildMemberRoleManager } from 'discord.js';
import { getListFromFile } from '../helpers/functions';

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    if (!interaction.isStringSelectMenu()) return;
    if (!(interaction.customId === 'reaction-courses')) return;
    const addedCourses = [];
    const rolesList = getListFromFile('data/courses.json');
    const rolesSelected = interaction.values;
    // Assign roles
    for (const course of rolesList) {
      const courseRole = await interaction.guild.roles.fetch(course.role.id);
      if (courseRole) {
        const roles = interaction.member.roles as GuildMemberRoleManager;
        await roles.remove(courseRole);
        for (const selection of rolesSelected) {
          if (selection === course.name) {
            // Course = course to add, selection = selection matching that
            await roles.add(courseRole);
            addedCourses.push(courseRole.name);
          }
        }
      }
    }
    await interaction.reply({ content: 'Roles added: ' + addedCourses.join(', '), ephemeral: true });
  }
}