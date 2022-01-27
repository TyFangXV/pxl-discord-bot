require('dotenv').config();
const fs = require('fs');
const discord = require('discord.js');
const uuid = require('uuid').v4;

const interactionState = require("./state/interaction");
const config = require('./config.js');
const menuInteractionHanlder = require("./handler/interaction");
const supabase = require('../utils/supabase/initialize');


const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES] });
client.command = new discord.Collection();
const token = process.env.DISCORD_BOT_TOKEN;
let prefix;

(async()=> prefix = await config.prefix())()
const roles = new Set();

config.command.forEach((cmd) => {
    //searches for file that end with .js
    const commandFiles = fs
      .readdirSync(`./src/command/${cmd.type}`)
      .filter((file) => file.endsWith('.js'));

    //sets every file that end with .js as a command

    for (const file of commandFiles) {
      const command = require(`./command/${cmd.type}/${file}`);
      client.command.set(command.name, command, command.status);
    }
});





client.on('ready', async() => {
  client.user.setStatus('online');
  client.user.setActivity('Powered by Swag');
  console.log("Bot is online xx");
  const guildCache = client.guilds.cache;
  console.log(prefix);
  setInterval(async()=> {await getMuted(guildCache);console.log("working");}, 60000);

});






client.on('messageCreate',  (message) => {

      //add the roles of the server to the roles set
      message.guild.roles.cache.map(async(role) => {
        if(!roles.has(role)){
          roles.add(role)
        }
      })
       if (message.author.bot) return;


       //check if message started with prefix
       if (!message.content.startsWith(prefix) || message.author.bot) return;
       
       /*
       //check if the role id in the config files are valid
       if(roles.size !== 0){
        let loopIndex = 0;
        config.roles.map(async(role) => {
          roles.forEach(async(item) => {
            if(loopIndex !== config.roles.length){
                if(item.id !== role.id){
                  message.channel.send(`${item.name} is not registered in the config file`);
                  loopIndex++;
                }              
            }

          })
        })
      }
      */


        if(message.content.startsWith(prefix))
        {
            const command = message.content.slice(prefix.length).trim(" ").toLowerCase().split(" ")[0];

            if(client.command.has(command))
            {
              const id = uuid();
              interactionState.add({command : command, id : id, authorID :  message.author.id})
              client.command.get(command).execute(message, client);
            }
        }
});







//get the people that are muted from teh DB and check if the duration has passed away from the timestamp of the mute
const getMuted = async(guildCache) => {
  const {data, error} = await supabase.from("mute").select("*");
  if(error) return console.log(error);
  if(data.length === 0) return;
  data.forEach(async(item) => {
    const member = await guildCache.get(item.guild_id).members.fetch(item.user_id);
    if(!member) return;
    const role = guildCache.get(item.guild_id).roles.cache.find((role) => role.name === "muted");
    if(!role) return;
    const now = new Date();
    const time = new Date(item.time);

    if(Date.parse(now) < Date.parse(time))
    {
      console.log(`${member.user.username} is still muted`);
      return;
    }else{
      const {data,error } = await supabase.from("mute").delete().match({user_id : item.user_id});  
        member.roles.remove(role);
        console.log(`${member.user.username} has been unmuted`);
    console.log(data, error);
    }
  });


}







client.on("interactionCreate", async(interaction)=>{   
    if(interaction.isSelectMenu()){
       await menuInteractionHanlder(interaction)
    }
})


client.login(token);
