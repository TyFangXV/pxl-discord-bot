const config = require("../../config");

module.exports = {
 name : 'unmute',
 description : 'unmute the muted users',
 mode : 'mod' ,
 async execute(message, client) {
    const user = message.mentions.users.first();
    //get the args from the message
    const args = message.content.slice(await config.prefix()).trim().split(/ +/);
    const reason = args.slice(2).join(' ');
    const mutedRole = 'muted';
  
    //check if the nessessary args are present
    if (!reason) {
      message.channel.send('Please fill in the require parameters');
      return;
    }
  
    const {data, error} = await supabase.from("mute").delete().match({user_id : user.id});  
      const member = await message.guild.members.fetch(user.id);
      const role = message.guild.roles.cache.find((role) => role.name === "muted");
      if(!role) return;
      member.roles.remove(role);
      console.log(`${member.user.username} has been unmuted`);
      message.channel.send(`${member.user.username} has been unmuted`);
  },

 async helpCenter(message){
  
  }
}