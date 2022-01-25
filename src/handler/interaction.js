const interactionState = require("../state/interaction")
const selectMenuInteractionEventHandler = require('../state/interactionEvent');


const menu = async(interaction)=>{
    let id;

    if(interaction.customId === "help"){

        //get the id of the interaction
        interactionState.forEach(async(item) => {
            if(item.command === "help"){
                selectMenuInteractionEventHandler.emit("interactionHelp", {id : item.id, value : interaction.values});
            }
        })

        interaction.reply("tutel")

    



    }
}

module.exports = menu;