

module.exports = {
  prefix: '>',
  command : [
      {type : 'general', template(name, description, mode){ return `module.exports = {\n name : '${name}',\n description : '${description}',\n mode : '${mode}' ,\n async execute(message, args) {\n   //code here\n}}`;``}},
      {type : 'admin', template(name, description, mode){ return `module.exports = {\n name : '${name}',\n description : '${description}',\n mode : '${mode}' ,\n async execute(message, args) {\n   //code here\n}}`;``}},
      {type : 'mod', template(name, description, mode){ return `module.exports = {\n name : '${name}',\n description : '${description}',\n mode : '${mode}' ,\n async execute(message, args) {\n   //code here\n}}`;``}},
    ],
};

