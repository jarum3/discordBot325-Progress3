# Group 7 - CSC-325 Discord Bot
This bot is built off of [this previous point](https://github.com/jarum3/discordBot325-Progress1)

This bot seeks to create an effective system for managing roles automatically, specifically with a structure designed for students having access to channels for certain courses.

This bot runs from [app.js](app.js), processes commands as exports with a data and async execute function section from [commands/](commands/), stores data in [data/](data/), handles event interaction in [events/](events/), and has several useful definitions for functions and objects under [helpers/](helpers/). To create new commands, create a file in [commands/](commands/) following the structure of other commands already available, then fill in necessary fields to distinguish its name, description, and functionality.

Additionally, [This ESLint file](.eslintrc.json) lists out rules for formatting when pushing code, I'd recommend using some automatic linter to ensure those rules are followed. Since this is a work in progress, several files have unused variable checking turned off temporarily.

## .env
This bot requires a .env file, titled `.env` as its full name, with no hidden file extensions, in the root directory of the application, in the same location as package.json

The structure of  that file should look like this:
```
CLIENT_TOKEN='[Token from bot through the discord dev portal]'
CLIENT_ID="[The bot user's ID]"
TESTING="[TRUE or FALSE]"
```

## Deploying commands
Since Discord puts a rate limit to the number of times you can submit commands in a given day, that's handled in a separate file. 
Run [deploy-commands.js](deploy-commands.js) after adding any new command files, or on a new bot.

# Description of progress
## Updates from previous starting point
- [x] **Lock permissions for essentially all current slash-commands behind administrative privileges**
- [x] Adjusting structure of roles and functions to be more practical
- [x] Commands for adding and dropping courses and optional roles from saved lists
- [x] Commands for generating a dropdown that both displays that list, and assigns roles to members on interactions
- [x] Separation into testing commands for easier deployment

## To-do
- [ ] Create functionality to create, populate, and archive categories and attach those to role objects
- [ ] Validate file saving further to reduce concurrency conflicts
- [ ] Clean up edge cases for role deletions outside of bot interactions

## Previous features
- [x] Generating random valid colors (Sourced from [here](https://css-tricks.com/snippets/javascript/random-hex-color/)), and adjusting the brightness of those colors by a certain amount (Sourced from [here](https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors))
- [x] Checking input colors against a regular expression to ensure validity
- [x] Creating roles, channels, and categories programmatically
- [x] Structure for course data, methods, and optional role data