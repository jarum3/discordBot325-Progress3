import { ColorResolvable, Colors, Role, CategoryChannel, Guild, ChannelType, TextChannel, PermissionsBitField, OverwriteType, ActionRowBuilder, SelectMenuComponentOptionData, StringSelectMenuBuilder, GuildChannelManager, NewsChannel } from 'discord.js';
import { CourseRole, OptionalRole } from './role';
import * as fs from 'node:fs';

/**
 * Reads in semester data from text file, written by admin command
 * @returns {string} string of first line of semester file, which should contain current semester
 */
export function getSemester(): string {
  if (!fs.existsSync('data/currentsemester.txt')) fs.writeFileSync('data/currentsemester.txt', '');
  return fs.readFileSync('data/currentsemester.txt').toString().split('\n')[0];
}

/**
 * Writes a string to a file to be read later as semester data
 * @param string The value of the current semester
 */
export function writeSemester(string: string): void {
  fs.writeFileSync('data/currentsemester.txt', string);
}

/**
 * Simply parses a file into lines as strings
 * @param file path to file to read lines from
 * @returns {string[]} array of strings, one for each line in the file
 */
export function parseLines(file: string): string[] {
  return fs.readFileSync(file).toString().split('\n');
}

export async function createChannel(guild: Guild, name: string): Promise<TextChannel> {
  return guild.channels.create({
    name: name,
    type: ChannelType.GuildText,
  })
    .then(channel => {
      return channel;
    })
    .catch(channel => {
      console.error('Error creating channel: ' + channel.name);
      return undefined;
    });
}

export async function createCategory(name: string, ChannelManager: GuildChannelManager, role: Role = undefined,): Promise<CategoryChannel> {
  if (role) {
    return ChannelManager.create({
      name: name,
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: ChannelManager.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel],
          type: OverwriteType.Role,
        },
        {
          id: role.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
          type: OverwriteType.Role,
        },
      ],
    });
  }
  else {
    return ChannelManager.create({
      name: name,
      type: ChannelType.GuildCategory,
    })
      .then(category => {
        return category;
      })
      .catch(category => {
        return undefined;
      })
  }
}

export async function RoleSelectMenu(customId: string, multi: boolean): Promise<ActionRowBuilder<StringSelectMenuBuilder>> {
  const rolesList = getListFromFile('data/optroles.json') as OptionalRole[];
  if (rolesList.length === 0) {
    return undefined;
  }
  const options: SelectMenuComponentOptionData[] = [];
  let row: ActionRowBuilder<StringSelectMenuBuilder>;
  rolesList.forEach((element: OptionalRole) => options.push({ label: element.name, description: element.description, value: element.name }));
  if (multi) {
    row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder('Nothing selected')
      .setMinValues(1)
      .setMaxValues(options.length)
      .addOptions(options));
  }
  else {
    row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder('Nothing selected')
      .addOptions(options));
  }
  return row;
}

export async function CourseSelectMenu(customId: string, multi: boolean): Promise<ActionRowBuilder<StringSelectMenuBuilder>> {
  const rolesList = getListFromFile('data/courses.json') as CourseRole[];
  if (rolesList.length === 0) {
    return undefined;
  }
  const options: SelectMenuComponentOptionData[] = [];
  rolesList.forEach((element: CourseRole) => options.push({ label: element.name, description: element.name, value: element.name }));
  const max = multi ? options.length : 1;
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(new StringSelectMenuBuilder()
    .setCustomId(customId)
    .setPlaceholder('Nothing selected')
    .setMinValues(1)
    .setMaxValues(max)
    .addOptions(options));
  return row;
}

export async function archiveCategory(category: CategoryChannel, originalRole: Role, newRole: Role): Promise<void> {

}

export async function createRole(guild: Guild, name: string, color: ColorResolvable): Promise<Role> {
  return guild.roles.create({
    name: name,
    color: color as ColorResolvable,
  })
    .then(role => {
      return role;
    })
    .catch(role => {
      console.error('Error creating role ' + role.name);
      return undefined;
    });
}
/**
 * Writes a list to given file as JSON
 * @param {import('./role').CourseRole[] | import('./role').OptionalRole[]} list - List to write in as json
 * @param {string} file - Valid file path to read from
 */
export function saveListToFile(list: CourseRole[] | OptionalRole[], file: string): void {
  // TODO Solve possible concurrency problems
  const listJson = JSON.stringify(list);
  fs.writeFileSync(file, listJson, 'utf-8');
}
/**
 * Reads in a list of roles from a file as JSON
 * @param {string} file - valid file path to read from
 * @returns {import('./role').CourseRole[] | import('./role').OptionalRole[]}
 */
export function getListFromFile(file: string): CourseRole[] | OptionalRole[] {
  // TODO Solve possible concurrency problems
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]');
  const text = fs.readFileSync(file).toString('utf-8');
  return JSON.parse(text);
}
/**
 * Determines if given color is valid hex or color descriptor
 * @param {any} strColor - Possible color string
 * @returns {boolean} - True if color is valid hex or color descriptor
 */
export function isColor(strColor: any): boolean {
  const RegExp = /(^#?[0-9A-F]{6}$)|(^#?[0-9A-F]{3}$)/i; // Regex to check if the input is a valid hex code.
  return Object.keys(Colors).includes(capitalizeString(strColor)) || RegExp.test(strColor);
}

/**
 * Capitalizes first letter of a string
 * @param {string} string - String to be capitalized
 * @returns {string} string with first character capitalized
 */
export function capitalizeString(string: string): string {

  return string.charAt(0).toUpperCase + string.slice(1);
}

/**
 * Generates a valid hex code
 * @returns {ColorResolvable} random hex code as 6-character ColorResolvable
 */
export function generateColor(): ColorResolvable {
  return Math.floor(Math.random() * 16777215).toString(16) as ColorResolvable;
}

export async function createAndPopulateCategory(course: CourseRole, ChannelManager: GuildChannelManager) {
  const categoryName = course.jointClass
    ? course.prefix + ' ' + course.number + ' / ' + course.jointClass + ' - ' + getSemester()
    : course.prefix + ' ' + course.number + ' - ' + getSemester();
  const courseNumber: string = course.jointClass
    ? course.number + '-and-' + course.jointClass.split('-')[1]
    : course.number;
  course.category = await createCategory(categoryName, ChannelManager, course.role);
  createChannelInCat(course, 'announcements-' + courseNumber, true);
  createChannelInCat(course, 'zoom-meeting-info-' + courseNumber, true);
  if (course.video) {
    const videoChannel = await createChannelInCat(course, 'how-to-make-a-video', true);
    const messages = parseLines('data/videoMessages.txt');
    messages.forEach(message => videoChannel.send(message));
  }
  createChannelInCat(course, 'introduce-yourself');
  createChannelInCat(course, 'chat');
  return course.category;
}

export async function createChannelInCat(course: CourseRole, name: string, readOnly: boolean = false) {
  let newChannel: TextChannel = await createChannel(course.category.guild, name)
    .then(channel => {
      return channel;
    })
    .catch(channel => {
      return undefined;
    });
  if (newChannel) {
    newChannel = await newChannel.setParent(course.category);
    await newChannel.lockPermissions();
    if (readOnly) await newChannel.permissionOverwrites.edit(course.role.id, { SendMessages: false });
    return newChannel;
  }
  else return undefined;
}

/**
 * Adjusts a color's brightness by a number value
 * @param {string} col - Color to be adjusted, as a 6-character hexadecimal string
 * @param {number} amt - Amount to adjust by, positive values create a brighter color and negative values create a dimmer color
 * @returns {string | undefined} The color input adjusted by amt value, or undefined if string is invalid
 */
export function adjustColor(col: string, amt: number): string | undefined {

  if (!isColor(col)) return undefined;
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
}