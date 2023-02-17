import { CategoryChannel, Role, TextChannel } from "discord.js";
import { createChannel, archiveCategory, createCategory, getSemester, parseLines } from './functions';
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
  video: Boolean;
  /** A course to share a category with this course, one-directional (Child class has joint class, parent class does not.) */
  jointClass: string | undefined;
  /** Keeps track of the category associated with this class */
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
    const categoryName = this.jointClass
      ? this.prefix + ' ' + this.number + ' / ' + this.jointClass + ' - ' + getSemester()
      : this.prefix + ' ' + this.number + ' - ' + getSemester();
    this.category = await createCategory(categoryName, this.role);
    this.createChannelInCat('announcements-' + this.number);
    this.createChannelInCat('zoom-meeting-info-' + this.number);
    if (this.video) {
      const videoChannel = await this.createChannelInCat('how-to-make-a-video');
      const messages = parseLines('../data/videoMessages.txt');
      messages.forEach(message => videoChannel.send(message));
    }
    this.createChannelInCat('introduce-yourself');
    this.createChannelInCat('chat');
  }
  async createChannelInCat(name: string): Promise<TextChannel> {
    const newChannel = await createChannel(this.category.guild, name);
    if (newChannel) {
      newChannel.setParent(this.category);
      newChannel.lockPermissions();
    }
    return newChannel;
  }
  /**
   * Archives the category, including role permission changeoff
   */
  archiveCategory() {
    archiveCategory(this.category, this.role, this.veteranRole);
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
  constructor(name: string, role: Role, description: string = undefined) {
    this.name = name;
    this.description = description;
    this.role = role;
  }
}