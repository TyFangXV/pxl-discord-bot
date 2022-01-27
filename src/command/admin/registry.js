const Discord = require("discord.js")
const config = require("../../config.js")
const supabase = require("../../../utils/supabase/initialize")
module.exports = {
 name : 'registry',
 description : 'register settings for the server',
 mode : 'admin' ,
 async execute(message, client) {
   const prefix = await config.prefix()
   const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const name = args.slice(1)[0];
    const value = args.slice(2).join(' ');
    const {data, error} = await supabase.from("registry").insert({
      name: name,
      value: value
    });

    if(error)
    {
      const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Error')
        .setDescription(
          `Something went wrong; For more info type "**${prefix}help registry**"`
        )
        .setThumbnail(message.author.avatarURL())
        .setTimestamp();
      message.channel.send({ embeds: [embed] });
    }

    if(!error)
    {
      const embed = new Discord.MessageEmbed()  
      .setColor('#0099ff')
      .setTitle('Success')
      .setDescription(`${name} has been registered`)
      .setThumbnail(message.author.avatarURL())
      .setTimestamp();
      message.channel.send({ embeds: [embed] });
    }

  
},
 async helpCenter(message){
  const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Help')
    .setDescription(
      `This command is used to register settings for the server.\n\n**Usage:**\n\n${prefix}registry <setting> <value>\n\n**Example:**\n\n${prefix}registry prefix !\n\n**Settings:**\n\nprefix\n\n**Description:**\n\nThis is the prefix for the bot.\n\n**Example:**\n\n${prefix}registry prefix !\n\n**Value:**\n\nThe value for the setting.\n\n**Example:**\n\n${prefix}registry prefix !\n\n**Note:**\n\nThe value for the setting must be a string.`
    )
    .setThumbnail(message.author.avatarURL())
    .setTimestamp();
  message.channel.send({ embeds: [embed] });

}
}