/**
 * Simple ping command that lists time to server, for checking that bot is running
 * @packageDocumentation
 */
import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
// Pings, returns time pinged. A template for other commands.
module.exports = {

  data: new SlashCommandBuilder().setName('help').setDescription('Embeds with Pong!'),
  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('Help')
      .setColor(0x0099FF)
      .setDescription('These are a list of commands and a brief description of their purpose.')
      .setAuthor({ name: '325-Bot - List of Commands' })
      .addFields(
        { name: 'Add Course (/addcourse)', value: 'Adds a course to the list of courses for this server. Creates the course role with a random color, and the veteran role with a desaturated version.\nTakes parameters video, for whether the course needs a read-only channel describing how to make videos, and joint, for if the course shares a classroom with another course.' },
        { name: 'Add Opt Role (/addoptrole)', value: 'Adds an optional role for students to join. Creates the optional role with a random color.' },
        { name: 'Remove Course (/removecourse)', value: 'Removes a course from the list of courses for this server. Deletes the course role, and deletes the veteran role if no users have it.' },
        { name: 'Remove Opt Role (/removeoptrole)', value: 'Removes an optional role from the list of roles for this server. Deletes the server role.' },
        { name: 'Select Courses Builder (/selectcoursesbuilder)', value: 'Creates a dropdown for students to select roles for courses. Use this in a channel students should access to receive roles.' },
        { name: 'Opt Roles Builder (/optrolesbuilder)', value: 'Creates a dropdown for students to select optional roles. Use this in a channel students should access to receive roles.' },
        { name: 'Set Semester (/setsemester)', value: 'Sets the upcoming semester value, appended to each category' },
        { name: 'Start Semester (/startsemester)', value: 'Uses the currently-defined courses and optional roles to start a new semester.\nAutomatically creates channels. permissions, transfers over student roles, and archives old channels.' },
        { name: 'Create Course Category (/createcoursecategory)', value: 'Creates a category populated with appropriate channels given a course.' },
        { name: 'Delete Category (/deletecategory)', value: '!!WARNING!! THIS COMMAND IS DESTRUCTIVE. USE WITH CAUTION. \nDeletes a given category, and all the channels inside it. By default, Discord lets all channels in a deleted category float to the top of the channel list.' },
      )
      .setFooter({ text: 'As always, if you need help feel free to reach out!' });

    await interaction.reply({ embeds: [embed] });
  },
};