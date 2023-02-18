/**
 * 
 * @packageDocumentation
 */
import { User, Events } from 'discord.js';
module.exports = {
  name: Events.GuildMemberAdd,
  execute(member: User) {
    console.log(`The following user has joined: ${member.tag}`);
  },
};
