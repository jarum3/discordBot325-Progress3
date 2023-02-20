/**
 * Menu that takes a selected course and creates a server category, 
 * populated with channels and messages, based on a selected role. 
 * Takes several seconds to run, so its response needs to be deferred.
 * # Command
 * * This menu is generated by the 
 * {@link commands/testing/createcoursecategory | Create course category command}.
 * @packageDocumentation
 */
import { CategoryChannel } from 'discord.js';
import { Events, BaseInteraction } from 'discord.js';
import { createAndPopulateCategory, getListFromFile, saveListToFile } from '../../helpers/functions';
import { CourseRole } from '../../helpers/role';

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    if (!interaction.isStringSelectMenu()) return;
    if (!(interaction.customId === 'create-category')) return;
    if (!interaction.guild) return;
    const rolesList = getListFromFile('data/courses.json') as CourseRole[];
    const courseSelectedString = interaction.values[0];
    const selectedCourseObject = rolesList.find((element: CourseRole) => element.name === courseSelectedString)
    if (selectedCourseObject) {
      const selectedCourse = rolesList.indexOf(selectedCourseObject);
      const guild = interaction.guild;
      let jointChild;
      const jointChildObject = rolesList.find(element => element.jointClass === rolesList[selectedCourse].name)
      if (jointChildObject) jointChild = rolesList.indexOf(jointChildObject);
      let jointParent: CourseRole | undefined;
      let courseCategory: CategoryChannel | undefined = rolesList[selectedCourse].category;
      if (rolesList[selectedCourse].jointClass) jointParent = rolesList.find(element => element.name === rolesList[selectedCourse].jointClass);
      if (jointChild) {
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
        if (courseCategory) {
          if (await guild.channels.fetch(courseCategory.id)) {
            await interaction.update({ content: 'Sorry, that category already exists, it was possibly created as part of a joint course.', components: [] });
            return;
          }
        }
        await interaction.deferUpdate()
        const category = await createAndPopulateCategory(rolesList[selectedCourse], guild.channels);
        rolesList[selectedCourse].category = category;
        if (jointChild && rolesList[jointChild]) rolesList[jointChild].category = category;
        saveListToFile(rolesList, 'data/courses.json');
        await interaction.editReply({ content: 'Category created!', components: [] });
      }
      else await interaction.update('Sorry, this command cannot be used outside of guilds.');
    }
    // Shouldn't reach here, but the error-check is necessary for compilation
    else await interaction.update('Sorry, that role wasn\'t found in the list.');
  }
}