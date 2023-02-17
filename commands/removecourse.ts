import { ChatInputCommandInteraction, SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, SelectMenuComponentOptionData } from 'discord.js';
import { CourseRole } from 'helpers/role';
import { getListFromFile } from 'helpers/functions';
// Adds a course to the list of courses, with a role and veteran role attached
module.exports = {
  data: new SlashCommandBuilder()
    .setName('removecourse')
    .setDescription('Provides a dropdown to remove courses')
    .setDefaultMemberPermissions(0),
  async execute(interaction: ChatInputCommandInteraction) {
    const rolesList = getListFromFile('data/courses.json') as CourseRole[];
    if (rolesList.length === 0) {
      await interaction.reply({ content: 'There are no courses currently in the list.', ephemeral: true });
      return;
    }
    const options: SelectMenuComponentOptionData[] = [];
    rolesList.forEach((element: CourseRole) => options.push({ label: element.name, description: element.name, value: element.name }));
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(new StringSelectMenuBuilder()
      .setCustomId('remove-courses')
      .setPlaceholder('Nothing selected')
      .setMinValues(1)
      .setMaxValues(options.length) // Registers as a multi-choice menu when more than 1 course is available
      .addOptions(options));
    await interaction.reply({ content: 'Please select which courses you\'d like to remove:', components: [row], ephemeral: true });
  },
};