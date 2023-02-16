const { Events } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName); // Set command equal to the object in the command file.
      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`); // Print out an error if no command was found
        return;
      }
      try {
        await command.execute(interaction); // Run the execute block of the command
      }
      catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'reaction-courses') {
        const addedCourses = [];
        const funcs = require('../helpers/functions');
        const rolesList = funcs.getListFromFile('data/courses.json');
        const rolesSelected = interaction.values;
        // Assign roles
        for (const course of rolesList) {
          const courseRole = await interaction.guild.roles.fetch(course.role.id);
          if (courseRole) {
            await interaction.member.roles.remove(courseRole);
            for (const selection of rolesSelected) {
              if (selection === course.name) {
                // Course = course to add, selection = selection matching that
                await interaction.member.roles.add(courseRole);
                addedCourses.push(courseRole.name);
              }
            }
          }
        }
        await interaction.reply({ content: 'Roles added: ' + addedCourses.join(', '), ephemeral: true });
      }

      if (interaction.customId === 'reaction-roles') {
        const addedRoles = [];
        const funcs = require('../helpers/functions');
        const rolesList = funcs.getListFromFile('data/optroles.json');
        const rolesSelected = interaction.values;
        // Assign roles
        for (const role of rolesList) {
          const optRole = role.role;
          if (optRole) {
            await interaction.member.roles.remove(optRole);
            for (const selection of rolesSelected) {
              if (selection === role.name) {
                // Course = course to add, selection = selection matching that
                await interaction.member.roles.add(optRole.id);
                addedRoles.push(optRole.name);
              }
            }
          }
        }
        await interaction.reply({ content: 'Roles added: ' + addedRoles.join(', '), ephemeral: true });
      }

      if (interaction.customId === 'remove-courses') {
        const funcs = require('../helpers/functions');
        const rolesList = funcs.getListFromFile('data/courses.json');
        const rolesSelected = interaction.values;
        const removedRoles = [];
        // Assign roles
        for (const selectedElement of rolesSelected) {
          for (const course of rolesList) {
            if (course.name != selectedElement) continue;
            const courseRole = await interaction.guild.roles.fetch(course.role.id);
            const veteranRole = await interaction.guild.roles.fetch(course.veteranRole.id);
            // Deletes roles if their members are empty
            if (courseRole && courseRole.members.size === 0) interaction.guild.roles.delete(courseRole, 'Deleted as part of course deletion');
            if (veteranRole && veteranRole.members.size === 0) interaction.guild.roles.delete(veteranRole, 'Deleted as part of course deletion');
            rolesList.splice(rolesList.indexOf(course), 1);
            removedRoles.push(course.name);
            funcs.saveListToFile(rolesList, 'data/courses.json');
          }
        }
        await interaction.reply({ content: 'Courses removed: ' + removedRoles.join(', '), ephemeral: true });
      }

      if (interaction.customId === 'remove-roles') {
        const funcs = require('../helpers/functions');
        const rolesList = funcs.getListFromFile('data/optRoles.json');
        const rolesSelected = interaction.values;
        const removedRoles = [];
        // Assign roles
        for (const selectedElement of rolesSelected) {
          for (const course of rolesList) {
            if (course.name != selectedElement) continue;
            const optRole = await interaction.guild.roles.fetch(course.role.id);
            // Deletes role fully
            if (optRole) interaction.guild.roles.delete(optRole, 'Deleted as part of Optional Role deletion');
            rolesList.splice(rolesList.indexOf(course), 1);
            removedRoles.push(course.name);
            funcs.saveListToFile(rolesList, 'data/optroles.json');
          }
        }
        await interaction.reply({ content: 'Roles removed: ' + removedRoles.join(', '), ephemeral: true });
      }
    }
  },
};