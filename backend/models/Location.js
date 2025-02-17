import { DataTypes } from "sequelize"
import { v4 as uuidv4 } from 'uuid'


const Location = (sequelize) => {
  const Location = sequelize.define("location", {
    id: {
      type: DataTypes.STRING,
      default: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("PRIVAAT", "PUBLIEK", "COMMERCIEEL" ,"ONBEKEND")
    },
    vacatedSince: {
      type: DataTypes.DATE,
      default: 0
    },
    address: {
      type: DataTypes.STRING,
      defaultValue: true
    },
    city: {
      type: DataTypes.STRING,
      defaultValue: true
    },
    latitude: {
      type: DataTypes.FLOAT,
      default: 0
    },
    longitude: {
      type: DataTypes.FLOAT,
      default: 0
    },
  })
  return Location
}

export default Location
