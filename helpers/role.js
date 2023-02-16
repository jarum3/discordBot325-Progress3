/* eslint-disable no-unused-vars */

module.exports = {
  CourseRole: class {
    constructor(options) {
      this.prefix = options.prefix;
      this.number = options.number;
      this.name = options.prefix + '-' + options.number;
      if (options.name) this.name = options.name;
      this.role = options.role;
      this.veteranRole = options.veteranRole;
      this.video = options.video;
      this.jointClass = options.jointClass;
    }
    createAndPopulateCategory(video, joint) {
      const funcs = require('./functions');
      const courseName = joint ? this.prefix + ' ' + this.number : this.prefix + ' ' + this.number + ' / ' + joint;
      // TODO move category code in here so that it can return its promise
      this.category = funcs.createCategory(courseName + ' - ' + funcs.getSemester());
      funcs.createChannel('announcements-' + this.number, this.category);
      funcs.createChannel('zoom-meeting-info-' + this.number, this.category);
      if (this.video) {
        funcs.createChannel('how-to-make-a-video', this.category);
        // TODO: #5 Fill with messages
      }
      funcs.createChannel('introduce-yourself', this.categoryId);
      funcs.createChannel('chat', this.categoryId);
    }
    archiveCategory(category) {
      const { archiveCategory } = require('./functions');
      // TODO #6 edit this so that it can pass in its own category as a category object
      archiveCategory(category);
      return 0;
    }
  },

  OptionalRole: class {
    constructor(options) {
      this.name = options.name;
      this.description = options.description;
      this.role = options.role;
    }
  },
};