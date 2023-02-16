const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildCreate,
  execute(guild) {
    console.log(`The client has joined guild: ${guild.name}`);
  },
};
