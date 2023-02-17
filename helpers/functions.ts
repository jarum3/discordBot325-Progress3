import { ColorResolvable, Colors } from 'discord.js';
import { CourseRole, OptionalRole } from './role';
/* eslint-disable no-unused-vars */
export async function getSemester() {
  // TODO #3 Get current semester
  return 0;
}
export function saveListToFile(list: CourseRole[] | OptionalRole[], file: File): void {
  // TODO Verify that this works
  const fs = require('fs');
  const listJson = JSON.stringify(list);
  fs.writeFileSync(file, listJson, 'utf-8');
}
export function getListFromFile(file: File): CourseRole[] | OptionalRole[] {
  // TODO verify that this works
  const fs = require('fs');
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]');
  const text = fs.readFileSync(file).toString('utf-8');
  return JSON.parse(text);
}
export function isColor(strColor: any): boolean {
  const RegExp = /(^#?[0-9A-F]{6}$)|(^#?[0-9A-F]{3}$)/i; // Regex to check if the input is a valid hex code.
  return Object.keys(Colors).includes(capitalizeString(strColor)) || RegExp.test(strColor);
}

export function capitalizeString(string: string): string {
  return string.charAt(0).toUpperCase + string.slice(1);
}

export function generateColor(): ColorResolvable {
  return Math.floor(Math.random() * 16777215).toString(16) as ColorResolvable;
}

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