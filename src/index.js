require("dotenv").config();
const discord = require("discord.js");
const config = require("./config.js");

const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS] });
const token = process.env.DISCORD_BOT_TOKEN;
const prefix = config.prefix;



client.on("ready", () => console.log("I am ready!"));



client.on("message", async(message) => {
    
})


client.login(token);