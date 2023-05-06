//dependenciass instaladas en este proyecto : express, mongoose, nodemon -D, dotenv

const express = require("express");
const app = express();

// npm i dotenv - dependencia para gestionar las variables de entorno
// require("dotenv").config();

//npm i mongose - dependencia para conectar MongoDB y poder gestionar los documentos de la BBDD
const mongoose = require("mongoose");

//npm i cors - para desplegar datos en front
// app.use(cors())

// hay que importarlos siempre y cuando utilizamos directamente el router
// const AuthorRouter = require("./router/AuthorRouter");
// const BookRouter = require("./router/BookRouter");

// sintaxis para poder gestionar los datos por req.body
app.use(express.json({ extended: true }));
app.use(express.urlencoded());

//ENRUTADO para la carpeta ROUTER
// app.use("/api", AuthorRouter);
// app.use("/api", BookRouter);

app.use("/api/client", require("./routes/ClientRouter"));
app.use("/api/membership", require("./routes/MembershipRouter"));
app.use("/api/payment", require("./routes/PaymentRouter"));
app.use("/api/privateroom", require("./routes/PrivateRoomRouter"));
app.use("/api/reservation", require("./routes/ReservationRouter"));
app.use("/api/activemembership", require("./routes/ActiveMembershipRouter"));
app.use("/api/hours", require("./routes/HoursRouter"));



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
// const url = "mongodb+srv://facunquintana:nS3XIqH6bdQEyqtL@orugacoworking.gyoky1q.mongodb.net/?retryWrites=true&w=majority";