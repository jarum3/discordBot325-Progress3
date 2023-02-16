/* eslint-disable no-unused-vars */
module.exports = {
  createRole: async function (guild, roleName, color) {
    // Create a new role
    guild.roles.create({
      name: roleName,
      color: color,
    })
      .then(role => {
        return role;
      })
      .catch(console.error());
  },
  createCategory: async function (guild, categoryName, role) {
    const { ChannelType } = require('discord.js');
    const createdChannel = await guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildCategory,
    })
      .then(category => console.log('Created category: ' + category.name))
      .catch(category => console.error('Error creating category: ' + category.name));
    // TODO #1 lock permissions to the given role object
    return createdChannel;
  },
  createChannel: async function (guild, channelName, category) {
    const { ChannelType } = require('discord.js');
    const createdChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
    })
      .then(channel => console.log('Created channel: ' + channel.name))
      .catch(channel => console.error('Error creating channel: ' + channel.name));
    createdChannel.setParent(category);
    createdChannel.lockPermissions();
    return createdChannel;
  },
  archiveCategory: function (category) {
    // TODO #2 Archive a category
    return 0;
  },
  getSemester: function () {
    // TODO #3 Get current semester
    return 0;
  },
  saveListToFile: function (list, file) {
    // TODO Verify that this works
    const fs = require('fs');
    const listJson = JSON.stringify(list);
    fs.writeFileSync(file, listJson, 'utf-8');
    return 0; // Can return other values if this errors
  },
  getListFromFile: function (file) {
    // TODO verify that this works
    const fs = require('fs');
    const text = fs.readFileSync(file).toString('utf-8');
    return JSON.parse(text);
  },
  isColor: function (strColor) {
    const { Colors } = require('discord.js');
    const RegExp = /(^#?[0-9A-F]{6}$)|(^#?[0-9A-F]{3}$)/i; // Regex to check if the input is a valid hex code.
    return Object.keys(Colors).includes(this.capitalizeString(strColor)) || RegExp.test(strColor);
  },
  capitalizeString: function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  generateColor: function () {
    return Math.floor(Math.random() * 16777215).toString(16);
  },

  adjustColor: function (col, amt) {
    let usePound = false;
    if (col[0] == '#') {
      col = col.slice(1);
      usePound = true;
    }
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
  },
};