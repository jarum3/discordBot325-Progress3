module.exports = {
  deployCommands: function () {
    const { REST, Routes } = require('discord.js');
    const fs = require('node:fs');
    const path = require('node:path');
    require('dotenv').config();

    const commands = [];
    const commandsPath = path.join(__dirname, 'commands'); // Grabbing command directory
    // Grabbing all files ending in .js
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      // Push each command data to the commands list as JSON
      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
      }
      else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
    if (process.env.testing.toLowerCase() === 'true') {
      const testingPath = path.join(__dirname, 'commands/testing'); // Grabbing testing directory
      // Grabbing all files ending in .js
      const testingFiles = fs.readdirSync(testingPath).filter(file => file.endsWith('.js'));

      for (const file of testingFiles) {
        const filePath = path.join(testingPath, file);
        const command = require(filePath);
        // Push each command data to the commands list as JSON
        if ('data' in command && 'execute' in command) {
          commands.push(command.data.toJSON());
        }
        else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
      }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

    (async () => {
      try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
          Routes.applicationCommands(process.env.CLIENT_ID),
          { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
      }
      catch (error) {
        console.error(error);
      }
    })();
  },
};

module.exports.deployCommands();