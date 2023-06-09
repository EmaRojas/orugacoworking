const express = require("express");
const roomSchema = require("../models/room");
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
    await roomSchema.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Sala eliminada!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


module.exports = RoomRouter


