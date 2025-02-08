import express from "express"
import sequelize from "./services/db.js"
import cors from "cors"
import locationApi from "./routes/locationApi.js"
var app = express()

/* Sync database */
await sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {})
  .catch((err) => {
    console.log(err)
  })

/* Global api configurations */
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
)


export var clients = []

/* Add the location API route */
app.use(locationApi)

const PORT = process.env.PORT || 5050

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
