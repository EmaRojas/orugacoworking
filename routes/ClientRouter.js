const express = require("express");
const clientSchema = require("../models/client");
const ClientRouter = express.Router();


/**
 * @typedef {object} Client
 * @property {string} full_name.required
 * @property {string} phone.required
 * @property {string} email.required
 * @property {string} company_name.required
 * @property {string} cuit.required
 * @property {string} description.required
 * @property {string} assistance.required
 */
/**
 * POST /api/v1/client
 * @tags Client
 * @summary Crear un nuevo cliente
 * @param {Client} request.body.required
 * @return {object} 200 - song response
 */
ClientRouter.post("/", async (req, res) => {
  const client = clientSchema(req.body);

  if (!client.full_name || !client.phone || !client.email || !client.company_name || !client.cuit || !client.description || !client.assistance) {
    return res.status(400).send({
      success: false,
      message: "Faltan datos de completar"
    });
  }

  client
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
 * GET /api/v1/client
 * @tags Client
 * @summary Obtiene todos los clientes
 * @return {string} 200 - success response
 * @return {object} 400 - Bad request response
 */
ClientRouter.get("/", async (req, res) => {
  let clients = await clientSchema.find({});
  return res.status(200).send({
    success: true,
    clients
  });
});

//update
/**
 * @typedef {object} Client
 * @property {string} full_name.required
 * @property {string} phone.required
 * @property {string} email.required
 * @property {string} company_name.required
 * @property {string} cuit.required
 * @property {string} description.required
 * @property {string} assistance.required
 */
/**
 * PUT /api/v1/client/{id}
 * @tags Client
 * @summary Actualizar cliente
 * @param {string} id.path - id
 * @param {Client} request.body.required
 * @return {string} 200 - success response
 */
ClientRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;

  let client = await clientSchema.findByIdAndUpdate(id, data, { new: true });

  res.status(200).send({
    success: true,
    message: "Cliente modificado!",
    client
  });
});

/**
 * delete /api/v1/client/{id}
 * @tags Client
 * @summary Eliminar cliente
 * @param {string} id.path - id
 * @return {string} 200 - success response
 */
ClientRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await clientSchema.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Cliente eliminado!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


module.exports = ClientRouter


