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

    if (interaction.customId === 'course-remove') {
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

    if (interaction.customId === 'role-remove') {
      // TODO add handling for deleting one part of a joint course, reject it and say the child needs to be deleted first
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
      const rolesList = getListFromFile('data/courses.json') as CourseRole[];
      const courseSelectedString = interaction.values[0];
      const selectedCourse = rolesList.indexOf(rolesList.find((element: CourseRole) => element.name === courseSelectedString));
      const guild = interaction.guild;
      const jointChild = rolesList.indexOf(rolesList.find(element => element.jointClass === rolesList[selectedCourse].name));
      let jointParent: CourseRole;
      if (rolesList[selectedCourse].jointClass) jointParent = rolesList.find(element => element.name === rolesList[selectedCourse].jointClass);
      if (rolesList[jointChild]) {
        if (rolesList[jointChild].category) {
          rolesList[selectedCourse].category = rolesList[jointChild].category;
        }
      }
      if (jointParent) {
        rolesList[selectedCourse].jointClass = jointParent.name;
        if (jointParent.category) {
          rolesList[selectedCourse].category = jointParent.category;
        }
      }
      if (rolesList[selectedCourse].category) {
        if (guild.channels.fetch(rolesList[selectedCourse].category.id)) {
          await interaction.update({ content: 'Sorry, that category already exists, it was possibly created as part of a joint course.', components: [] });
          return;
        }
      }
      await interaction.deferUpdate()
      const category = await createAndPopulateCategory(rolesList[selectedCourse], guild.channels);
      rolesList[selectedCourse].category = category;
      if (rolesList[jointChild]) rolesList[jointChild].category = category;
      saveListToFile(rolesList, 'data/courses.json');
      await interaction.editReply({ content: 'Category created!', components: [] });
    }
  }
}