const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,
  execute(member) {
    console.log(`The following user has joined: ${member.tag}`);
  },
};
