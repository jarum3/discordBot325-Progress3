/**
 * Event handler for client ready, triggers when bot logs in.
 * @packageDocumentation
 */
import { Events, Client } from 'discord.js';

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    if (client.user) {
      console.log(`Ready! Logged in as ${client.user.tag}`);
      client.user.setActivity('Please use /help to get my commands!');
    }
  },
};
