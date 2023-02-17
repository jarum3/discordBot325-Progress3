import { SlashCommandStringOption, SlashCommandBuilder, ChannelType, PermissionsBitField, OverwriteType, SlashCommandRoleOption, ChatInputCommandInteraction } from "discord.js";

// Creates a new category, at the bottom, locked to the given role.
module.exports = {
  data: new SlashCommandBuilder()
    .setName('createcategory')
    .setDescription('Creates a new category')
    .addStringOption((option: SlashCommandStringOption) =>
      option.setName('name')
        .setDescription('The Name of the category'))
    .addRoleOption((option: SlashCommandRoleOption) =>
      option.setName('role')
        .setDescription('Role to restrict category to'))
    .setDefaultMemberPermissions(0),

  async execute(interaction: ChatInputCommandInteraction) {
    const name = interaction.options.getString('name');
    const role = interaction.options.getRole('role');
    await interaction.guild.channels.create({
      name: name,
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
          type: OverwriteType.Role,
        },
        {
          id: role.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
          type: OverwriteType.Role,
        },
      ],
    })
      .then(category => interaction.reply('Created category: ' + category.name))
      .catch(category => {
        interaction.reply('Error creating category.');
        console.log('Error creating category: ' + category.name);
      });
  },
};