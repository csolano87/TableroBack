const { DataTypes, Model, Sequelize } = require("sequelize");
const sequelize = require("../db/connection");

class Usuario extends Model{}
  Usuario.init(
  {
    doctor:
       DataTypes.STRING,
    
    codigo_doctor: 
       DataTypes.STRING,
    
    usuario: 
      DataTypes.STRING,
    
    password: 
       DataTypes.STRING,
    
    rol: 
      DataTypes.STRING,
    

    estado: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
  },

  {
   sequelize,
   modelName: "usuarios",
   timestamps: false,
  },
);

module.exports = Usuario;
