

module.exports = {
  prefix: '>',
  command : [
      {type : 'general',description : "These type of command are for fun and messing around",template(name, description, mode){ return `module.exports = {\n name : '${name}',\n description : '${description}',\n mode : '${mode}' ,\n async execute(message, args) {\n   //code here\n}}`;``}},
      {type : 'admin', description : "Only accessible by the Admin ", template(name, description, mode){ return `module.exports = {\n name : '${name}',\n description : '${description}',\n mode : '${mode}' ,\n async execute(message, args) {\n   //code here\n}}`;``}},
      {type : 'mod', description : "Only accessible by the mod ", template(name, description, mode){ return `module.exports = {\n name : '${name}',\n description : '${description}',\n mode : '${mode}' ,\n async execute(message, args) {\n   //code here\n}}`;``}},
    ],
};

