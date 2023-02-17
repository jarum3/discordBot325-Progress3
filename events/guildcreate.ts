import { Events, Guild } from 'discord.js';

module.exports = {
  name: Events.GuildCreate,
  execute(guild: Guild) {
    console.log(`The client has joined guild: ${guild.name}`);
  },
};
