const supabase = require('../../../utils/supabase/initialize');
const config = require('../../config');
const { Permissions } = require('discord.js');
const Discord = require('discord.js');
let prefix;

(async()=> prefix = await config.prefix())()


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
    const args = message.content.slice(await config.prefix().length).trim().split(/ +/);
    const duration = args.slice(2)[0];
    const reason = args.slice(3).join(' ');

    const roles = new Set();
    message.guild.roles.cache.forEach(async(role) => {
      roles.add(role);
    })

    //check if the nessessary args are present
    if (!duration || !reason) {
      message.channel.send('Please fill in the require parameters');
      return;
    }

    const DuratioValidation = TimeValidator(duration);

    if (DuratioValidation === false) {
      const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Error')
        .setDescription(
          `Please enter a valid time; For more info type "**$prefix}help mute**"`
        )
        .setThumbnail(message.author.avatarURL())
        .setTimestamp();
      message.channel.send({ embeds: [embed] });
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

      //check if the user has the mod, admin or owner role
      if(roles.has())

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

      const res = await supabase.from('mute').insert({
        user_id: user.id,
        guild_id: message.guild.id,
        channel_id: message.channel.id,
        duration: DuratioValidation.toString(),
        time: new Date(),
        reason: args.slice(3).join(' ') || 'No reason provided',
      });

      //check if the mute is registered in the database
      console.log(res);
      if (res !== null) {
        const embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Mute')
          .setDescription(
            `${user} has been muted for ${duration} for ${
              args.slice(3).join(' ') || 'No reason provided'
            } `
          )
          .setThumbnail(member.avatar)
          .setTimestamp();
        message.channel.send({ embeds: [embed] });
        //add the role to the user
        member.roles.add(role);
        return;
      } else {
        console.log(res.error);
      }
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
      .addField('Usage', `${prefix}mute @user <duration> <reason>`)
      .addField('Description', 'Mute a user')
      .addField('Example', `${prefix}mute @drex 3m spam`)
      .addField(
        'Supported duration',
        `**1m** = 1 minute\n**1h** = 1 hour\n**1d** = 1 day\n`
      )
      .addField('Permission', 'Moderator')
      .setTimestamp();
    message.channel.send({ embeds: [embed] });
  },
};
