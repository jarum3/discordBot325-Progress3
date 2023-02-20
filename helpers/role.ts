import { CategoryChannel, Role } from 'discord.js';
/**
 * A class to store course role data, including a veteran role and data on course attributes
 */
export class CourseRole {
  /** Prefix for course, examples: CSC, CIS, SOC */
  prefix: string;
  /** Number for course, examples: 101, 300, 325 */
  number: string;
  /** Name of course, optional, automatically generated based on prefix and number if omitted */
  name: string;
  /** Role for active students */
  role: Role;
  /** Role for students that have passed through a class, should be able to access archives */
  veteranRole: Role;
  /** Whether or not the course requires video information */
  video: boolean;
  /** A course to share a category with this course, bi-directional (both classes point to each other) */
  jointClass: string | undefined;
  /** Keeps track of the category associated with this class */
  category: CategoryChannel | undefined;
  /**
   * @constructor
   * @param {{ prefix: string, number: string, role: Role, veteranRole: Role, video?: boolean, jointClass?: string}} options Set of options for course data
   */
  constructor({ prefix, number, role, veteranRole, video = false, jointClass = undefined, name = undefined }: { prefix: string; number: string; role: Role; veteranRole: Role; video?: boolean; jointClass?: string; name?: string; }) {
    this.prefix = prefix;
    this.number = number;
    this.name = prefix + '-' + number;
    if (name) this.name = name;
    this.role = role;
    this.veteranRole = veteranRole;
    if (video) this.video = video;
    else this.video = false;
    this.jointClass = jointClass;
  }
}

/**
 * A class to handle optional roles, includes a description that is displayed to students
 */
export class OptionalRole {
  /** Holds name of optional role */
  name: string;
  /** A description of what the role signifies, displayed to students when selecting */
  description: string;
  /** Associated role to be assigned */
  role: Role;
  /**
   * @constructor
   * @param {string} name Name for optional role
   * @param {string} description Description to be displayed to students
   * @param {import('discord.js').Role} role object associated with course
   */
  constructor(name: string, role: Role, description: string) {
    this.name = name;
    this.description = description;
    this.role = role;
  }
}