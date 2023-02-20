/**
 * Event handler for the client joining a new guild, simply console logs currently.
 *
 * @packageDocumentation
 */
import { Events, Guild } from 'discord.js';

module.exports = {
  name: Events.GuildCreate,
  execute(guild: Guild) {
    console.log(`The client has joined guild: ${guild.name}`);
  },
};
