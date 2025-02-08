import { Sequelize } from "sequelize"

//Setup for the DB connection
const sequelize = new Sequelize(
  process.env.DB_NAME || "kraakkaart",
  process.env.DB_USER || "kraakkaart",
  process.env.DB_PASSWORD || "fuckleegstand",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: 5432
    // schema: "public"
  }
)

sequelize
  .authenticate()
  .then(() => {
    console.log("[Server] Connection to database established successfully.")
  })
  .catch((err) => {
    console.error("%c[Server] Failed to connect to database.")
    console.error(err)
  })

export default sequelize
