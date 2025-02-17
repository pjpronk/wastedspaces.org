import { DataTypes } from "sequelize"
import { v4 as uuidv4 } from 'uuid'


const Vote = (sequelize) => {
  const Vote = sequelize.define("vote", {
    id: {
      type: DataTypes.STRING,
      default: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("UP", "DOWN")
    },

  })
  return Vote
}

export default Vote
