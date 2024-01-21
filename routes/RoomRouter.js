const express = require("express");
const roomSchema = require("../models/room");
const priceRoomSchema = require("../models/priceRoom");
const membershipSchema = require("../models/membership");
const membershipByUserSchema = require("../models/membershipByUser");
const reservationSchema = require("../models/reservation");
const paymentSchema = require("../models/payment");

const RoomRouter = express.Router();


/**
 * @typedef {object} Room
 * @property {string} name.required
 * @property {string} capacity
 */
/**
 * POST /api/v1/room
 * @tags Room
 * @summary Crear una sala
 * @param {Room} request.body.required
 * @return {object} 200 - song response
 */
RoomRouter.post("/", async (req, res) => {
  const room = roomSchema(req.body);

  if (!room.name) {
    return res.status(400).send({
      success: false,
      message: "Faltan datos de completar"
    });
  }

  room
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
 * GET /api/v1/room
 * @tags Room
 * @summary Obtiene todas las salas
 * @return {string} 200 - success response
 * @return {object} 400 - Bad request response
 */
RoomRouter.get("/", async (req, res) => {
  let rooms = await roomSchema.find({});
  return res.status(200).send({
    success: true,
    rooms
  });
});

//update
/**
 * @typedef {object} Room
 * @property {string} name.required
 * @property {string} capacity
 */
/**
 * PUT /api/v1/room/{id}
 * @tags Room
 * @summary Actualizar sala
 * @param {string} id.path - id
 * @param {Room} request.body.required
 * @return {string} 200 - success response
 */
RoomRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;

  let room = await roomSchema.findByIdAndUpdate(id, data, { new: true });

  res.status(200).send({
    success: true,
    message: "Sala modificada!",
    room
  });
});

/**
 * delete /api/v1/room/{id}
 * @tags Room
 * @summary Eliminar sala
 * @param {string} id.path - id
 * @return {string} 200 - success response
 */
RoomRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Obtén todas las priceRooms sin importar el roomID
    const priceRooms = await priceRoomSchema.find({}).populate('roomID');

    // Itera sobre todas las priceRooms y elimina las que tengan el roomID especificado
    for (const priceRoom of priceRooms) {
      if (priceRoom.roomID._id.toString() === id) {
        await priceRoomSchema.findByIdAndDelete(priceRoom._id);
      }
    }

    const membershipsByUser = await membershipByUserSchema.find({}).populate('roomID');

    // Itera sobre todas las priceRooms y elimina las que tengan el roomID especificado
    for (const membershipByUser of membershipsByUser) {
      if (membershipByUser.roomID._id.toString() === id) {
        await membershipByUserSchema.findByIdAndDelete(membershipByUser._id);
        const paymentId = membershipByUser.paymentID;
        await paymentSchema.findByIdAndDelete(paymentId._id);
      }
    }

    const memberships = await membershipSchema.find({});

    for (const membership of memberships) {
      if (membership.roomID.toString() === id) {
        await membershipSchema.findByIdAndDelete(membership._id);
      }
    }

    const reservations = await reservationSchema.find({}).populate('roomID');

    // Itera sobre todas las priceRooms y elimina las que tengan el roomID especificado
    for (const reservation of reservations) {
      if (reservation.roomID._id.toString() === id) {
        await reservationSchema.findByIdAndDelete(reservation._id);
        const paymentId = reservation.paymentID;
        await paymentSchema.findByIdAndDelete(paymentId._id);
      }
    }
    // Luego, elimina la sala
    await roomSchema.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      message: "Sala eliminada junto con sus PriceRooms.",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = RoomRouter


