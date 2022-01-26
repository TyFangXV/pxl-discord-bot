const supabase = require('../../../utils/supabase/initialize');
const config = require('../../config');
const { Permissions } = require('discord.js');
const Discord = require('discord.js');


const TimeValidator = (time) => {
  const unit = time.slice(-1);
  const timeInt = parseInt(time.slice(0, -1));

  switch (unit) {
    case 's':
      return timeInt;
    case 'm':
      return timeInt * 60;
    case 'h':
      return timeInt * 60 * 60;
    case 'd':
      return timeInt * 60 * 60 * 24;
    default:
      return false;
  }
};


module.exports = {
  name: 'mute',

  description: 'mute players',

  mode: 'mod',

  async execute(message, client) {
    const user = message.mentions.users.first();
    //get the args from the message
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const duration = args.slice(2)[0];
    const reason = args.slice(3).join(' ');
    const mutedRole = 'muted';

    //check if the nessessary args are present
    if (!duration || !reason) {
      message.channel.send('Please fill in the require parameters');
      return;
    }

    const DuratioValidation = TimeValidator(duration);


    if(DuratioValidation === false){
      const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Error')
        .setDescription(`Please enter a valid time; For more info type "**${config.prefix}help mute**"`)
        .setThumbnail(message.author.avatarURL())
        .setTimestamp();
      message.channel.send({embeds : [embed]});
      return;
    }

    try {

      //check if the user isn't muted, they are in the guild, and they aren't a admin

      if (!user) {
        return message.channel.send('Please mention a user to mute');
      }

      const member = await message.guild.members.fetch(user);

      if (member === undefined) {
        return message.channel.send('That user is not in this server');
      }
      if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        return message.channel.send('You cannot mute an administrator');
      }
      if (
        member.roles.cache.has(
          message.guild.roles.cache.find((role) => role.name === mutedRole)
        )
      ) {
        return message.channel.send('That user is already muted');
      }

      const role = message.guild.roles.cache.find(
        (role) => role.name === mutedRole
      );
      member.roles.add(role);

        const res = await supabase.from('mute').insert({
          user_id: user.id,
          guild_id: message.guild.id,
          minutes : DuratioValidation,
          reason: args.slice(1).join(' ') || 'No reason provided',
        });

        const embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Mute')
          .setDescription(`${user} has been muted for ${duration} for ${args.slice(3).join(' ')|| 'No reason provided'} `)
          .setThumbnail(member.avatar)
          .setTimestamp();
        message.channel.send({embeds : [embed]});


    } catch (error) {
      console.log(error);
      message.channel.send(
        `**Error :- ${error.message}** <> please contact the bot owner`
      );
    }
  },

  async helpCenter(message) {
    const embed = new Discord.MessageEmbed()
      .setTitle('Help Center')
      .setColor('#0099ff')
      .setDescription('**Mute**')
      .addField('Usage', `${config.prefix}mute @user <duration> <reason>`)
      .addField('Description', 'Mute a user')
      .addField('Example', `${config.prefix}mute @drex 3m spam`)
      .addField(
        'Supported duration',
        `**1m** = 1 minute\n**1h** = 1 hour\n**1d** = 1 day\n`
      )
      .addField('Permission', 'Moderator')
      .setTimestamp();
    message.channel.send({embeds: [embed]});
  },
};
