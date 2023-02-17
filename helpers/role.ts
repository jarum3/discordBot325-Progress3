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
  constructor(prefix: string, number: string, name: string | undefined, role: Role, veteranRole: Role, video: Boolean | undefined, jointClass: string | undefined) {
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
  createAndPopulateCategory() {
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
  constructor(name: string, description: string | undefined, role: Role) {
    this.name = name;
    this.description = description;
    this.role = role;
  }
}