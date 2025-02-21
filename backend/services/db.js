import { Sequelize } from "sequelize"

//Setup for the DB connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
})

sequelize
  .authenticate({sync: true})
  .then(() => {
    console.log("[Server] Connection to database established successfully.")
  })
  .catch((err) => {
    console.error("%c[Server] Failed to connect to database.")
    console.error(err)
  })

export default sequelize
