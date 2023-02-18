import { Events, BaseInteraction, GuildMemberRoleManager } from 'discord.js';
import { OptionalRole, CourseRole } from '../helpers/role';
import { createAndPopulateCategory, getListFromFile, saveListToFile } from '../helpers/functions';

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId === 'reaction-courses') {
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

    if (interaction.customId === 'reaction-roles') {
      const addedRoles: string[] = [];
      const rolesList = getListFromFile('data/optroles.json');
      const rolesSelected = interaction.values;
      // Assign roles
      for (const role of rolesList) {
        const optRole = role.role;
        if (optRole) {
          const roles = interaction.member.roles as GuildMemberRoleManager;
          await roles.remove(optRole);
          for (const selection of rolesSelected) {
            if (selection === role.name) {
              // Course = course to add, selection = selection matching that
              await roles.add(optRole.id);
              addedRoles.push(optRole.name);
            }
          }
        }
      }
      await interaction.reply({ content: 'Roles added: ' + addedRoles.join(', '), ephemeral: true });
    }

    if (interaction.customId === 'remove-courses') {
      const rolesList = getListFromFile('data/courses.json') as CourseRole[];
      const rolesSelected = interaction.values;
      const removedRoles: string[] = [];
      // Assign roles
      for (const selectedElement of rolesSelected) {
        for (const course of rolesList) {
          if (course.name != selectedElement) continue;
          const courseRole = course.role;
          const veteranRole = course.veteranRole;
          // Deletes roles if their members are empty
          if (courseRole && courseRole.members.size === 0) interaction.guild.roles.delete(courseRole, 'Deleted as part of course deletion');
          if (veteranRole && veteranRole.members.size === 0) interaction.guild.roles.delete(veteranRole, 'Deleted as part of course deletion');
          rolesList.splice(rolesList.indexOf(course), 1);
          removedRoles.push(course.name);
          saveListToFile(rolesList, 'data/courses.json');
        }
      }
      await interaction.reply({ content: 'Courses removed: ' + removedRoles.join(', '), ephemeral: true });
    }

    if (interaction.customId === 'remove-roles') {
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

    if (interaction.customId === 'joint-course') {
      interaction.update({ content: interaction.values[0] + ' selected!', components: [] });
    }

    if (interaction.customId === 'create-category') {
      const RolesList = getListFromFile('data/courses.json') as CourseRole[];
      const courseSelectedString = interaction.values[0];
      const selectedCourse = RolesList.find((element: CourseRole) => element.name === courseSelectedString);
      const guild = interaction.guild;
      await interaction.deferUpdate()
      await createAndPopulateCategory(selectedCourse, guild.channels);
      await interaction.editReply({ content: 'Category created!', components: [] });
    }
  }
}