const config = require('../../config');
const discord = require("discord.js");

const selectMenuInteractionEventHandler = require("../../state/interactionEvent");
const { MessageActionRow, MessageSelectMenu } = require('discord.js');


module.exports = {
  name: 'help',
  description: 'to help players navigate',
  mode: 'general',
  async execute(message) {
    const embed = new discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Help')
      .setDescription('Here is a list of commands you can use')
      .setThumbnail(message.author.avatarURL())
      .setTimestamp();
    
    //select menu
    const menu =  new MessageSelectMenu()
    .setCustomId('help')
    .setPlaceholder('Select a topic')
    .addOptions([
      {
        label: 'general',
        value: 'general',
        description: 'general commands',
        emoji: '📱',
      },
      {
        label: 'mod',
        value: 'mod',
        description: 'mod commands',
        emoji: '🔨',
      },
    ])

    selectMenuInteractionEventHandler.on("interactionHelp", (msg)=>{
      console.log(msg);
  })

    const row = new MessageActionRow().addComponents(menu);
    message.channel.send({ embeds: [embed], components: [row] });

  },
};
