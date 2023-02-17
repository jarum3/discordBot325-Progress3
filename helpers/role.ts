/* eslint-disable no-unused-vars */

import { CategoryChannel, Role } from "discord.js";
export class CourseRole {
  prefix: string;
  number: string;
  name: string;
  role: Role;
  veteranRole: Role;
  video: Boolean;
  jointClass: string | undefined;
  category: CategoryChannel;
  /**
   * @constructor
   * @param {{ prefix: string, number: string, role: Role, veteranRole: Role, video: boolean, jointClass: string}} options Set of options for course data
   */
  constructor({ prefix, number, role, veteranRole, video = false, jointClass = undefined, name = undefined }: { prefix: string; number: string; role: Role; veteranRole: Role; video?: Boolean; jointClass?: string; name?: string; }) {
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

  /**
   * Creates a category, then populates it with channels
   */
  createAndPopulateCategory(): void {
    const funcs = require('./functions');
    const courseName = this.jointClass ? this.prefix + ' ' + this.number + ' / ' + this.jointClass : this.prefix + ' ' + this.number;
    // TODO move category code in here so that it can return its promise
    this.category = funcs.createCategory(courseName + ' - ' + funcs.getSemester());
    funcs.createChannel('announcements-' + this.number, this.category);
    funcs.createChannel('zoom-meeting-info-' + this.number, this.category);
    if (this.video) {
      funcs.createChannel('how-to-make-a-video', this.category);
      // TODO: #5 Fill with messages
    }
    funcs.createChannel('introduce-yourself', this.category);
    funcs.createChannel('chat', this.category);
  }
  /**
   * Archives the category, including role permission changeoff
   */
  archiveCategory() {
    const funcs = require('./functions');
    // TODO #6 edit this so that it can pass in its own category as a category object
    funcs.archiveCategory(this.category);
  }
}

export class OptionalRole {
  name: string;
  description: string;
  role: Role;
  /**
   * @constructor
   * @param {string} name Name for optional role
   * @param {string} description Description to be displayed to students
   * @param {import('discord.js').Role} role object associated with course
   */
  constructor(name: string, description: string | undefined, role: Role) {
    this.name = name;
    this.description = description;
    this.role = role;
  }
}