const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

//swagger
//https://brikev.github.io/express-jsdoc-swagger-docs/
const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
  info: {
    version: '1.0.0',
    title: 'Oruga',
  },
  security: {
    BasicAuth: {
      type: 'http',
      scheme: 'basic',
    },
  },
  baseDir: __dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: './routes/*.js',
  // URL where SwaggerUI will be rendered
  swaggerUIPath: '/api-docs',
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Open API JSON Docs endpoint.
  apiDocsPath: '/v1/api-docs',
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {},
  // multiple option in case you want more that one instance
  multiple: true,
};


const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded());

expressJSDocSwagger(app)(options);

/**
 * GET /api/v1/
 * @summary This is the summary of the endpoint
 * @return {object} 200 - success response
 */
app.use("/api/v1/client", require("./routes/ClientRouter"));
app.use("/api/v1/membership", require("./routes/MembershipRouter"));
app.use("/api/v1/room", require("./routes/RoomRouter"));
app.use("/api/v1/payment", require("./routes/PaymentRouter"));
app.use("/api/v1/priceRoom", require("./routes/PriceRoomRouter"));
app.use("/api/v1/reservation", require("./routes/ReservationRouter"));
app.use("/api/v1/membershipByUser", require("./routes/MembershipByUserRouter"));
app.use("/api/v1/usage", require("./routes/UsageRouter"));


// conexión BBDD
//antes definir vuestra url en el archivo .env
const URL = "mongodb+srv://facunquintana:nS3XIqH6bdQEyqtL@orugacoworking.gyoky1q.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(URL, {})
  .then(() => {
    console.log("BD is now connected");
  })
  .catch((err) => {
    console.log(err);
  });

//Servidor a la escucha
app.listen(3000, () => {
  console.log("Servidor a la escucha en el puerto 3000");
});