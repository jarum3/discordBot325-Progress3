import { ChatInputCommandInteraction, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, SelectMenuComponentOptionData, APIActionRowComponent, APIMessageActionRowComponent } from 'discord.js';
import { OptionalRole } from '../helpers/role';
module.exports = {
  data: new SlashCommandBuilder()
    .setName('optrolesbuilder')
    .setDescription('Creates a dropdown menu in this channel for students to select optional roles')
    .setDefaultMemberPermissions(0),
  async execute(interaction: ChatInputCommandInteraction) {
    const funcs = require('../helpers/functions');
    const rolesList = funcs.getListFromFile('data/optroles.json');
    if (rolesList.length === 0) {
      await interaction.reply({ content: 'There are no roles currently in the list.', ephemeral: true });
      return;
    }
    const options: SelectMenuComponentOptionData[] = [];
    rolesList.forEach((element: OptionalRole) => options.push({ label: element.name, description: element.description, value: element.name }));
    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(new StringSelectMenuBuilder()
      .setCustomId('reaction-roles')
      .setPlaceholder('Nothing selected')
      .setMinValues(1)
      .setMaxValues(options.length) // Registers as a multi-choice menu when more than 1 role is available
      .addOptions(options));
    await interaction.reply({ content: 'Please select which roles you would like to add:', components: [row] });
  },
};