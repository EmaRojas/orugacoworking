const express = require("express");
const ReservationSchema = require("../models/reservation");
const PaymentSchema = require("../models/payment");

const ReservationRouter = express.Router();


/**
 * @typedef {object} Reservation
 * @property {string} clientID.requiere
 * @property {string} roomID.required
 * @property {string} priceRoomID
 * @property {string} date.required
 */
/**
 * POST /api/v1/reservation
 * @tags Reservation
 * @summary Crear nueva reserva
 * @param {Reservation} request.body.required
 * @return {object} 200 - song response
 */
ReservationRouter.post("/", async (req, res) => {
  const reservation = ReservationSchema(req.body);

  console.log(req.body.priceRoomID);

  if (!reservation.clientID || !reservation.roomID) {
    return res.status(400).send({
      success: false,
      message: "Faltan datos de completar"
    });
  }

      // Crear el objeto de pago
      const payment = new PaymentSchema({
        means_of_payment: req.body.means_of_payment,
        total: req.body.total,
        paid: req.body.paid,
        status: 'Creado'
      });
  
      // Guardar el pago en la base de datos
      await payment.save();

      // Crear el objeto de reservation
      const reserva = new ReservationSchema({
        clientID: req.body.clientID,
        priceRoomID: req.body.priceRoomID,
        roomID: req.body.roomID,
        dateTime: req.body.dateTime,
        date: req.body.date,
        time: req.body.time,
        paymentID: payment._id
      });

      // Guardar la reserva en la base de datos
      await reserva.save()
      .then((data) => res.status(200).send({
       success: true,
       data
      }))
      .catch((error) => res.status(500).send({
       success: false,
       message: error.message,
      }));
});

//get all
/**
 * GET /api/v1/reservation
 * @tags Reservation
 * @summary Obtiene todas las reservas
 * @return {string} 200 - success response
 * @return {object} 400 - Bad request response
 */
ReservationRouter.get("/", async (req, res) => {
  let reservations = await reservationSchema.find({}).populate('clientID').populate('priceRoomID').populate('paymentID').populate('roomID');
  return res.status(200).send({
    success: true,
    reservations
  });
});

//update
/**
 * @typedef {object} Reservation
* @property {string} clientID.requiere
 * @property {string} roomID.required
 * @property {string} priceRoomID
 * @property {string} paymentID
 * @property {string} date.required
 */
/**
 * PUT /api/v1/reservation/{id}
 * @tags Reservation
 * @summary Actualizar reserva
 * @param {string} id.path - id
 * @param {Reservation} request.body.required
 * @return {string} 200 - success response
 */
ReservationRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;

  let reservation = await ReservationSchema.findByIdAndUpdate(id, data, { new: true });

  res.status(200).send({
    success: true,
    message: "Reserva modificado!",
    reservation
  });
});

/**
 * delete /api/v1/reservation/{id}
 * @tags Reservation
 * @summary Eliminar reserva
 * @param {string} id.path - id
 * @return {string} 200 - success response
 */
ReservationRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ReservationSchema.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Reserva eliminado!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});



module.exports = ReservationRouter


