const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const config = require('../../../src/config');
//generate a template a script for the command
const maker = async (name, description, mode) => {
  try {
    let code;

    //fetch the template code from the config file
    config.command.map((command, index) => {
        if (command.type === mode){
          console.log(typeof config.command[index].template(name, description, mode));
          code = config.command[index].template(name, description, mode);
        }
      })
    
    fs.writeFileSync(
      path.join(__dirname + `../../../../src/command/${mode}/${name}.js`),
      code
    );

    console.log(chalk.green(`Command ${name} created`));
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  maker,
};
