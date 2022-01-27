const supabase = require("../utils/supabase/initialize");


module.exports = {
  prefix: async()=> {
    //get the prefix from the database in the registry table
    const {data, error} = await supabase.from("registry").select("value").match({name : "prefix"});
    if(error) return ">";
    if(!error) return data[0].value;
  },
  command : [
      {type : 'general', emoji : '📱', description : "These type of command are for fun and messing around",template(name, description, mode){ return `module.exports = {\n name : '${name}',\n description : '${description}',\n mode : '${mode}' ,\n async execute(message, client) {\n   //code here\n}},\n async helpCenter(message){\n //code for help command \n}`;``}},
      {type : 'admin', emoji : '🔨', description : "Only accessible by the Admin ", template(name, description, mode){ return `module.exports = {\n name : '${name}',\n description : '${description}',\n mode : '${mode}' ,\n async execute(message, client) {\n   //code here\n}}\n async helpCenter(message){\n //code for help command \n}`;``}},
      {type : 'mod',emoji : '🔨', description : "Only accessible by the mod ", template(name, description, mode){ return `module.exports = {\n name : '${name}',\n description : '${description}',\n mode : '${mode}' ,\n async execute(message, client) {\n   //code here\n}}\n async helpCenter(message){\n //code for help command \n}`;``}},
    ],

    roles : [
      { 
        name : 'admin',
        id : 0
      },
      {
        name : 'mod',
        id : 0
      },
      {
        name : 'muted',
        id : 0
      },
      {
        name : "owner",
        id : 0
      }
    ],

};

