# Group 7 - CSC-325 Discord Bot
This bot is built off of [this previous point](https://github.com/jarum3/discordBot325-Progress1)

This bot seeks to create an effective system for managing roles automatically, specifically with a structure designed for students having access to channels for certain courses.

This bot runs from [app.js](app.js), processes commands as exports with a data and async execute function section from [commands/](commands/), stores data in [data/](data/), handles event interaction in [events/](events/), and has several useful definitions for functions and objects under [helpers/](helpers/). To create new commands, create a file in [commands/](commands/) following the structure of other commands already available, then fill in necessary fields to distinguish its name, description, and functionality.

Additionally, [This ESLint file](.eslintrc.json) lists out rules for formatting when pushing code, I'd recommend using some automatic linter to ensure those rules are followed. In cases where rules are manually disabled by-file or by-line, please include justification for why this needs to be done next to the disabling comment. For Visual Studio Code, make sure to include "typescript" under your "eslint.validate" settings.

# Getting started

## Typescript details
To compile this bot, use [This guide](https://www.typescripttutorial.net/typescript-tutorial/setup-typescript/) to get started with a typescript compiler on your system, then run tsc in the root directory. After this, copy .env files (described below) into the build directory. Alternatively, you can use ts-node as described in the guide above. These are also combined into scripts start (for ts-node) and start-prod (for a full compile and run.)

## .env
This bot requires a .env file, titled `.env` as its full name, with no hidden file extensions, in the root directory of the application (Whether running through ts-node or in the build directory for compiled javascript), in the same location as package.json

The structure of  that file should look like this:
```
CLIENT_TOKEN='[Token from bot through the discord dev portal]'
CLIENT_ID="[The bot user's ID]"
TESTING="[TRUE or FALSE]"
```

## Deploying commands
Since Discord puts a rate limit to the number of times you can submit commands in a given day, that's handled in a separate file. 
Run [deploy-commands.js](deploy-commands.ts) after adding any new command files, or on a new bot.

## Documentation
This source code is documented using several features specific to [Typedoc](https://typedoc.org/). This documentation can be generated using npm run docs, and can be hosted anywhere. Given the nature of many event handler and command handler modules, many of these are documented as the entire source file, rather than an individual function.

# Description of progress

## To-do
- [x] Handle joint course adding with temporary dropdown
- [ ] Currently, many errors are simply guarded against with return statements, but these cases should display a message to the user. These type-guards are generally at the top of files, checking that the command was executed within a guild, and valid data was provided.
- [ ] Create functionality to create, populate, and archive categories and attach those to role objects
- [ ] Create semester tracking system, attaching semester value to category names
- [ ] Create list of archived courses to keep track of, separate from removing a course
- [ ] Implement everything together with one start semester command, taking a semester's name as an argument. This should implement everything done so far for every course object, archiving old courses, creating roles if necessary. Then it should ask if the user is sure they'd like to do this, with a list of courses that will be added and a list of courses that will be archived.
- [ ] Implement a rollback feature to undo this semester change, using data entered during the semester starting process to undo each action step by step
- [ ] Validate file saving further to reduce concurrency conflicts
- [ ] Optionally, implement anonymized polls and a submission box.
- [x] Clean up edge cases for role deletions outside of bot interactions

## Previous features
- [x] **Lock permissions for essentially all current slash-commands behind administrative privileges**
- [x] Adjusting structure of roles and functions to be more practical
- [x] Commands for adding and dropping courses and optional roles from saved lists
- [x] Commands for generating a dropdown that both displays that list, and assigns roles to members on interactions
- [x] Separation into testing commands for easier deployment
- [x] Generating random valid colors (Sourced from [here](https://css-tricks.com/snippets/javascript/random-hex-color/)), and adjusting the brightness of those colors by a certain amount (Sourced from [here](https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors))
- [x] Checking input colors against a regular expression to ensure validity
- [x] Creating roles, channels, and categories programmatically
- [x] Structure for course data, methods, and optional role data