const interactionState = require("../state/interaction")
const selectMenuInteractionEventHandler = require('../state/interactionEvent');


const menu = async(interaction)=>{
    if(interaction.customId === "help"){
        selectMenuInteractionEventHandler.emit("interactionHelp", interaction.values);
    }
}

module.exports = menu;