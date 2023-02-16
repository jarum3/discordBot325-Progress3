const { SlashCommandBuilder } = require('discord.js');
// Adds a course to the list of courses, with a role and veteran role attached
module.exports = {
  data: new SlashCommandBuilder()
    .setName('addcourse')
    .setDescription('Adds a course to the list of courses')
    .addStringOption(option =>
      option.setName('prefix')
        .setDescription('Course prefix')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('number')
        .setDescription('Course number')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('video')
        .setDescription('Should the course require a videos channel')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('jointclass')
        .setDescription('Optionally, a course that this class should share a channel with')
        .setRequired(false)
        .addChoices(...(() => {
          const funcs = require('../helpers/functions');
          const rolesList = funcs.getListFromFile('data/courses.json');
          const choices = [];
          rolesList.forEach(element => choices.push({ name: element.name, value: element.name }));
          return choices;
        })()))
    .setDefaultMemberPermissions(0),
  async execute(interaction) {
    const funcs = require('../helpers/functions');
    const roleData = require('../helpers/role');
    const prefix = interaction.options.getString('prefix');
    const number = interaction.options.getString('number');
    const video = interaction.options.getBoolean('video');
    const jointClass = interaction.options.getString('jointclass');
    const rolesList = funcs.getListFromFile('data/courses.json');
    const serverRoles = [];
    interaction.guild.roles.cache.forEach(r => {
      serverRoles.push(r.name);
    });
    for (const course of rolesList) {
      if (course.prefix === prefix && course.number === number) {
        // If our course is already in the list, just return an error message
        interaction.reply({ content: 'A course with that name already exists.', ephemeral: true });
        return;
      }
    }
    const roleName = prefix + '-' + number;
    let color;
    let role = await interaction.guild.roles.cache.find(x => x.name === roleName);
    let veteranRole = await interaction.guild.roles.cache.find(x => x.name === roleName + ' Veteran');
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
        .catch(console.error());
    }
    else {
      color = role.hexColor;
    }
    if (!veteranRole) {
      const veteranColor = funcs.adjustColor(color, -35);
      veteranRole = await interaction.guild.roles.create({
        name: roleName + ' Veteran',
        color: veteranColor,
      })
        .then(x => {
          return x;
        })
        .catch(console.error());
    }
    const newCourse = new roleData.CourseRole({
      prefix: prefix,
      number: number,
      role: role,
      veteranRole: veteranRole,
      video: video,
      jointClass: jointClass,
    });
    rolesList.push(newCourse);
    funcs.saveListToFile(rolesList, 'data/courses.json');
    interaction.reply({ content: 'Course added!', ephemeral: true });
  },
};