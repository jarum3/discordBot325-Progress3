/**
 * Command that takes in a course and archives it, along with moving student roles, its physical position, and its permissions
 * @packageDocumentation
 */
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
// Pings, returns time pinged. A template for other commands.
module.exports = {
  data: new SlashCommandBuilder().setName('archivecourse').setDescription('Archives a course and all its students.'),
  async execute(interaction: ChatInputCommandInteraction) {
    // Move course into bottom physically, remove from course list, move students into veteran roles, save that data into file
    // IE REMOVE [role id] FROM [student id]
    // TODO
    // [ ] Move course to bottom, find first course of name matching current semester, then find first course after that not matching, put this course above that.
    // [ ] Change role permissions from student to veteran
    // [ ] Transfer student roles over, loop over each student with student role for this course, remove it, add the veteran role
    // [ ] Save transferred students to a file (listed above)
    // [ ] Transfer from current courses file to previous courses file (Remove category from current course copy)
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    interaction.editReply(`Pong!\nTook ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
  },
};