import { Events, BaseInteraction, GuildMemberRoleManager } from 'discord.js';
import { getListFromFile } from '../../helpers/functions';

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    if (!interaction.isStringSelectMenu()) return;
    if (!(interaction.customId === 'reaction-roles')) return;
    const addedRoles: string[] = [];
    const rolesList = getListFromFile('data/optroles.json');
    const rolesSelected = interaction.values;
    // Assign roles
    for (const role of rolesList) {
      const optRole = await interaction.guild.roles.fetch(role.role.id);
      if (optRole) {
        const roles = interaction.member.roles as GuildMemberRoleManager;
        await roles.remove(optRole);
        for (const selection of rolesSelected) {
          if (selection === role.name) {
            // Course = course to add, selection = selection matching that
            await roles.add(optRole.id);
            addedRoles.push(optRole.name);
          }
        }
      }
    }
    await interaction.reply({ content: 'Roles added: ' + addedRoles.join(', '), ephemeral: true });
  }
}
