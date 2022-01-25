require('dotenv').config();
const fs = require('fs');
const discord = require('discord.js');
const uuid = require('uuid').v4;

const interactionState = require("./state/interaction");
const config = require('./config.js');
const menuInteractionHanlder = require("./handler/interaction")


const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES] });
client.command = new discord.Collection();
const token = process.env.DISCORD_BOT_TOKEN;
const prefix = config.prefix;

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





client.on('ready', () => {
  client.user.setStatus('online');
  client.user.setActivity('Powered by Swag');
  console.log("Bot is online");
});



client.on('messageCreate',  (message) => {
        //check if message started with prefix
        if (!message.content.startsWith(prefix) || message.author.bot) return;

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


client.on("interactionCreate", async(interaction)=>{   
    if(interaction.isSelectMenu()){
       await menuInteractionHanlder(interaction)
    }
})


client.login(token);
