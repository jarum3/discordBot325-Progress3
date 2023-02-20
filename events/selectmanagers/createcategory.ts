import { Events, BaseInteraction } from 'discord.js';
import { createAndPopulateCategory, getListFromFile, saveListToFile } from '../../helpers/functions';
import { CourseRole } from '../../helpers/role';

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    if (!interaction.isStringSelectMenu()) return;
    if (!(interaction.customId === 'create-category')) return;
    const rolesList = getListFromFile('data/courses.json') as CourseRole[];
    const courseSelectedString = interaction.values[0];
    const selectedCourseObject = rolesList.find((element: CourseRole) => element.name === courseSelectedString)
    if (selectedCourseObject) {
      const selectedCourse = rolesList.indexOf(selectedCourseObject);
      const guild = interaction.guild;
      if (guild) {
        let jointChild;
        const jointChildObject = rolesList.find(element => element.jointClass === rolesList[selectedCourse].name)
        if (jointChildObject) jointChild = rolesList.indexOf(jointChildObject);
        let jointParent: CourseRole | undefined;
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
          if (await guild.channels.fetch(rolesList[selectedCourse].category.id)) {
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
      else await interaction.update('Sorry, this command cannot be used outside of guilds.');
    }
    // Shouldn't reach here, but the error-check is necessary for compilation
    else await interaction.update('Sorry, that role wasn\'t found in the list.');
  }
}