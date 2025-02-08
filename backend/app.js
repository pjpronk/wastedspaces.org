import express from "express"
import sequelize from "./services/db.js"
import locationApi from "./routes/locationApi.js"
var app = express()

/* Sync database */
await sequelize
  .sync({ force: true })
  // .sync()
  .then(() => {})
  .catch((err) => {
    console.log(err)
  })


export var clients = []

/* Add the location API route */
app.use(locationApi)

const PORT = process.env.PORT || 5050

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
