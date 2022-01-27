const config = require('../../config');
const discord = require('discord.js');
const fs = require('fs');
const interactionState = require('../../state/interaction');
const selectMenuInteractionEventHandler = require('../../state/interactionEvent');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'to help players navigate',
  mode: 'general',
  async execute(message, client) {

    const prefix = await config.prefix();
    //get the command name from the args then check if it exists and execute it
    const command = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = command[1];

    if (commandName) {
    if(client.command.has(commandName) && commandName !== 'help'){
      client.command.get(commandName).helpCenter(message);
    }else{
      message.channel.send("Command not found");
    }
    }

    if(!commandName){
    const embed = new discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Help')
      .setDescription('Here is a list of commands you can use')
      .setThumbnail(message.author.avatarURL())
      .setTimestamp();

    //select menu
    const menu = new MessageSelectMenu()
      .setCustomId('help')
      .setPlaceholder('Select a topic');

    config.command.forEach((cmd) => {
      menu.addOptions({
        label: cmd.type,
        value: cmd.type,
        description: cmd.description,
        emoji: cmd.emoji,
      });
    });

    selectMenuInteractionEventHandler.on('interactionHelp', (msg) => {
      //check if the session id is valid to reply and dms the user
      interactionState.forEach((item) => {
        if (item.id === msg.id && item.authorID === message.author.id) {
          const files = fs.readdirSync(`${__dirname}/../${msg.value}/`);
          const helpEmbed = new discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Help')
            .setThumbnail(
              'https://cdn.discordapp.com/attachments/934393146513702915/935578927244664912/528.png'
            )
            .setTimestamp();
          if (files.length === 0) {
            helpEmbed.setDescription(
              'There are no commands available for this topic'
            );
          } else {
            files.forEach((file) => {
              const command = require(`../../command/${msg.value}/${file}`);
              if (command.name !== 'help') {
                helpEmbed.addField(`>${command.name}`, command.description, true);
              }
            });
          }
          message.author.send({ embeds: [helpEmbed] });
          interactionState.delete(item);
        }
      });

    });

    const row = new MessageActionRow().addComponents(menu);
    message.author.send({ embeds: [embed], components: [row] });
  }
  },
  
};
