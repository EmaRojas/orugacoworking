const express = require("express");
const priceRoomSchema = require("../models/priceRoom");
const reservationSchema = require("../models/reservation");
const paymentSchema = require("../models/payment");

const PriceRoomRouter = express.Router();


/**
 * @typedef {object} PriceRoom
 * @property {string} roomID.required
 * @property {string} hour.required
 * @property {string} price.required
 */
/**
 * POST /api/v1/priceRoom
 * @tags PriceRoom
 * @summary Nuevo precio sala
 * @param {PriceRoom} request.body.required
 * @return {object} 200 - song response
 */
PriceRoomRouter.post("/", async (req, res) => {
  const priceRoom = priceRoomSchema(req.body);

  if (!priceRoom.roomID || !priceRoom.hour || !priceRoom.price) {
    return res.status(400).send({
      success: false,
      message: "Faltan datos de completar"
    });
  }

  priceRoom
    .save()
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
 * GET /api/v1/priceRoom
 * @tags PriceRoom
 * @summary Obtiene todos los precios de las salas
 * @return {string} 200 - success response
 * @return {object} 400 - Bad request response
 */
PriceRoomRouter.get("/", async (req, res) => {
  let priceRooms = await priceRoomSchema.find({}).populate('roomID');
  return res.status(200).send({
    success: true,
    priceRooms
  });
});

//update
/**
 * @typedef {object} PriceRoom
 * @property {string} roomID.required
 * @property {string} hour.required
 * @property {string} price.required
 */
/**
 * PUT /api/v1/priceRoom/{id}
 * @tags PriceRoom
 * @summary Actualizar precio sala
 * @param {string} id.path - id
 * @param {PriceRoom} request.body.required
 * @return {string} 200 - success response
 */
PriceRoomRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;

  let priceRoom = await priceRoomSchema.findByIdAndUpdate(id, data, { new: true });

  res.status(200).send({
    success: true,
    message: "Precio modificado!",
    priceRoom
  });
});

/**
 * delete /api/v1/priceRoom/{id}
 * @tags PriceRoom
 * @summary Eliminar precios
 * @param {string} id.path - id
 * @return {string} 200 - success response
 */
PriceRoomRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const reservations = await reservationSchema.find({}).populate('priceRoomID');

    // Itera sobre todas las priceRooms y elimina las que tengan el roomID especificado
    for (const reservation of reservations) {
      if (reservation.priceRoomID._id.toString() === id) {
        await reservationSchema.findByIdAndDelete(reservation._id);
        const paymentId = reservation.paymentID;
        await paymentSchema.findByIdAndDelete(paymentId._id);
      }
    }

    await priceRoomSchema.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Precio eliminado!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


module.exports = PriceRoomRouter


