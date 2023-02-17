import { SlashCommandStringOption, SlashCommandBuilder, SlashCommandBooleanOption, ChatInputCommandInteraction, ColorResolvable } from "discord.js";
import { generateColor, getListFromFile, adjustColor, saveListToFile } from "../helpers/functions";
import { CourseRole } from "../helpers/role";
// Adds a course to the list of courses, with a role and veteran role attached
module.exports = {
  data: new SlashCommandBuilder()
    .setName('addcourse')
    .setDescription('Adds a course to the list of courses')
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('prefix')
        .setDescription('Course prefix')
        .setRequired(true))
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('number')
        .setDescription('Course number')
        .setRequired(true))
    .addBooleanOption((option: SlashCommandBooleanOption) =>
      option.setName('video')
        .setDescription('Should the course require a videos channel')
        .setRequired(false))
    .addBooleanOption(option =>
      option.setName('jointclass')
        .setDescription('Whether to generate a dropdown to add a joint course, only one course needs to do this.')
        .setRequired(false))
    .setDefaultMemberPermissions(0),
  async execute(interaction: ChatInputCommandInteraction) {
    const prefix = interaction.options.getString('prefix');
    const number = interaction.options.getString('number');
    const video = interaction.options.getBoolean('video');
    const jointClassTrue = interaction.options.getBoolean('jointclass');
    let jointClass;
    const rolesList: CourseRole[] = getListFromFile('data/courses.json') as CourseRole[];
    const serverRoles = [];
    // TODO add handling for joint courses, generate a dropdown, get an interaction, then edit the message with the dropdown with the interaction reply
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
    let color: ColorResolvable;
    let role = await interaction.guild.roles.cache.find(x => x.name === roleName);
    let veteranRole = await interaction.guild.roles.cache.find(x => x.name === roleName + ' Veteran');
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
    if (!veteranRole) {
      const veteranColor = adjustColor(color.toString(), -35) as ColorResolvable;
      veteranRole = await interaction.guild.roles.create({
        name: roleName + ' Veteran',
        color: veteranColor,
      })
        .then(x => {
          return x;
        })
        .catch(x => {
          console.error('Something went wrong when creating role ' + x.name);
          return undefined;
        });
    }
    const newCourse: CourseRole = new CourseRole({
      prefix: prefix,
      number: number,
      role: role,
      veteranRole: veteranRole,
      video: video,
      jointClass: jointClass,
    });
    rolesList.push(newCourse);
    saveListToFile(rolesList, 'data/courses.json');
    interaction.reply({ content: 'Course added!', ephemeral: true });
  },
};