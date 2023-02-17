import { ColorResolvable, Colors, Role, CategoryChannel } from 'discord.js';
import { CourseRole, OptionalRole } from './role';
import * as fs from 'node:fs';
/* eslint-disable no-unused-vars */
export async function getSemester() {
  // TODO Get current semester
  return 0;
}

export async function createChannel(name: string, categpry: CategoryChannel)/*: Promise<GuildTextBasedChannel>*/ {
}

export async function createCategory(name: string, role: Role)/*: Promise<CategoryChannel>*/ {

}

export async function archiveCategory(category: CategoryChannel, originalRole: Role, newRole: Role): Promise<void> {

}
/**
 * Writes a list to given file as JSON
 * @param {import('./role').CourseRole[] | import('./role').OptionalRole[]} list - List to write in as json
 * @param {string} file - Valid file path to read from
 */
export function saveListToFile(list: CourseRole[] | OptionalRole[], file: string): void {
  // TODO Verify that this works
  const listJson = JSON.stringify(list);
  fs.writeFileSync(file, listJson, 'utf-8');
}
/**
 * Reads in a list of roles from a file as JSON
 * @param {string} file - valid file path to read from
 * @returns {import('./role').CourseRole[] | import('./role').OptionalRole[]}
 */
export function getListFromFile(file: string): CourseRole[] | OptionalRole[] {
  // TODO verify that this works
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