import { Events, BaseInteraction } from 'discord.js';

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: BaseInteraction) {
    if (!interaction.isStringSelectMenu()) return;
    if (!(interaction.customId === 'joint-course')) return;
    interaction.update({ content: interaction.values[0] + ' selected!', components: [] });
  }
}