const inquirer = require('inquirer');
const chalk = require('chalk');
const config = require('../../src/config');
const commandMaker = require('./util/commandMaker');
const fs = require('fs');

(async () => {
  try {
    //get the name, description and the mode of the command
    const { name, description, mode } = await inquirer.prompt([
      { type: 'input', message: 'Command name', name: 'name' },
      { type: 'input', message: 'Command description', name: 'description' },
      {
        type: 'list',
        message: 'Command_mode',
        name: 'mode',
        choices: ['general', 'mod', 'admin'],
      },
    ]);


    //generate the folder for all the modes if they don't exist
    config.command.forEach((command) => {
        if (!fs.existsSync(`./src/command/${command.type}`)) {
            fs.mkdirSync(`./src/command/${command.type}`);
        }
    });

    //check if the command already exist
    if (fs.existsSync(`${__dirname}/../../src/command/${mode}/${name}.js`)) {
      console.log(chalk.red(`Command ${name} already exists`));
      return;
    }

    if(!fs.existsSync(`${__dirname}/../../src/command/${mode}/${name}.js`))
    {
        await commandMaker.maker(name, description, mode);
    }
  } catch (error) {
    console.log("error");
  }
})();
