/**
 * Slash-command to add a course to the list.
 * Attaches active or veteran roles matching its name or creates new ones if none is found.
 * # Parameters
 * ## Prefix
 * * Course prefix (Ex. CIS, CSC, LIN)
 * ## Number
 * * Course number (Ex. 101, 200, 325)
 * ## Video
 * * Optional boolean for if the course requires a tutorial on video creation
 * ## jointclass
 * * Optional boolean for if another course needs to share a category with the generated course
 * # Menu
 * * Jointclass creates a dropdown to select a course string, with CustomId 'joint-course', defined in the {@link events/selectmanagers/jointcourse | Joint course event handler}.
 * @packageDocumentation
 */
import { SlashCommandStringOption, SlashCommandBuilder, SlashCommandBooleanOption, ChatInputCommandInteraction, ColorResolvable } from 'discord.js';
import { generateColor, getListFromFile, adjustColor, saveListToFile, createRole, CourseSelectMenu } from '../helpers/functions';
import { CourseRole } from '../helpers/role';
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
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.guild) {
      await interaction.reply('This command is only valid in guilds.');
      return;
    }
    await interaction.deferReply({ ephemeral: true });
    const prefix = interaction.options.getString('prefix');
    const number = interaction.options.getString('number');
    let video = interaction.options.getBoolean('video');
    if (!video) video = false;
    const jointClass = interaction.options.getBoolean('jointclass');
    const rolesList: CourseRole[] = getListFromFile('data/courses.json') as CourseRole[];
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
    let color: ColorResolvable;
    let role = interaction.guild.roles.cache.find(x => x.name.toLowerCase() === roleName.toLowerCase());
    let veteranRole = interaction.guild.roles.cache.find(x => x.name.toLowerCase() === roleName.toLowerCase() + ' veteran');
    if (!role) {
      color = generateColor();
      while (interaction.guild.roles.cache.find(x => x.hexColor as ColorResolvable === color)) {
        // Keep generating a new color until no role matches it
        color = generateColor();
      }
      role = await createRole(interaction.guild, roleName, color);
    }
    else {
      color = role.hexColor;
    }
    if (!veteranRole) {
      const veteranColor = adjustColor(color.toString(), -35) as ColorResolvable;
      veteranRole = await createRole(interaction.guild, roleName + ' Veteran', veteranColor);
    }
    if (prefix && number && role && veteranRole && (video != undefined)) {
      if (jointClass) {
        const row = await CourseSelectMenu('joint-course', false);
        if (row) await interaction.editReply({ content: 'Please select a course to share a category with', components: [row] });
        else {
          await interaction.editReply({
            content: 'There are no courses defined currently, please define a course before adding a joint course under it.',
          });
          return;
        }
        while ((await interaction.fetchReply()).components.length > 0) {
          continue;
        }
        const jointClassString = (await interaction.fetchReply()).toString().split(' ')[0];

        const newCourse: CourseRole = new CourseRole({
          prefix: prefix,
          number: number,
          role: role,
          veteranRole: veteranRole,
          video: video,
          jointClass: jointClassString,
        });
        const newRolesList = getListFromFile('data/courses.json') as CourseRole[];
        if (!newRolesList.includes(newCourse)) {
          newRolesList.push(newCourse);
          const newJointClass = newRolesList.find(element => element.name === newCourse.jointClass);
          if (newJointClass) newRolesList[newRolesList.indexOf(newJointClass)].jointClass = newCourse.name;
          saveListToFile(newRolesList, 'data/courses.json');
          await interaction.editReply('Course added!');
        }
      }
      else {
        const newCourse: CourseRole = new CourseRole({
          prefix: prefix,
          number: number,
          role: role,
          veteranRole: veteranRole,
          video: video,
        });
        const newRolesList = getListFromFile('data/courses.json') as CourseRole[];
        if (!newRolesList.includes(newCourse)) {
          newRolesList.push(newCourse);
          saveListToFile(newRolesList, 'data/courses.json');
          interaction.editReply({ content: 'Course added!' });
        }
      }
    }
  },
};
