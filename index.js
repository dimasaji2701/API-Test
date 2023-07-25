const express = require('express')
const dotenv = require('dotenv')
var cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require("./src/docs/swagger.json");

const app = express()
const port = 8080
const router = require('./src/routers/main')

const options = {
  customCssUrl: "https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css",
};

dotenv.config()

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, options)
  );
app.use(cors())
app.use(express.json())
app.use("/", router)
app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})