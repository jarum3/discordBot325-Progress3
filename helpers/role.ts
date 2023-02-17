import { CategoryChannel, Role } from "discord.js";
import { createChannel, createCategory, archiveCategory, getSemester } from 'helpers/functions';
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
  async createAndPopulateCategory(): Promise<void> {
    const courseName = this.jointClass ? this.prefix + ' ' + this.number + ' / ' + this.jointClass : this.prefix + ' ' + this.number;
    // TODO move category code in here so that it can return its promise
    // this.category = await createCategory(courseName + ' - ' + getSemester(), this.role);
    createChannel('announcements-' + this.number, this.category);
    createChannel('zoom-meeting-info-' + this.number, this.category);
    if (this.video) {
      createChannel('how-to-make-a-video', this.category);
      // TODO: #5 Fill with messages
    }
    createChannel('introduce-yourself', this.category);
    createChannel('chat', this.category);
  }
  /**
   * Archives the category, including role permission changeoff
   */
  archiveCategory() {
    // TODO #6 edit this so that it can pass in its own category as a category object
    archiveCategory(this.category, this.role, this.veteranRole);
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
  constructor(name: string, role: Role, description: string = undefined) {
    this.name = name;
    this.description = description;
    this.role = role;
  }
}