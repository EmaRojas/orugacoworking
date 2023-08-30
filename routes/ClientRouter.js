const express = require("express");
const clientSchema = require("../models/client");
const ClientRouter = express.Router();
const MembershipByUserSchema = require("../models/membershipByUser");
const UsageSchema = require("../models/usage");


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

  if (!client.full_name || !client.phone || !client.email || !client.company_name || !client.cuit || !client.assistance) {
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

/**
 * GET /api/v1/client/{email}
 * @tags Client
 * @summary Obtiene un cliente por su dirección de correo electrónico
 * @param {string} email.path - Dirección de correo electrónico del cliente
 * @return {object} 200 - success response
 * @return {object} 404 - Not found response
 */
ClientRouter.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const client = await clientSchema.findOne({ email });

    if (!client) {
      return res.status(404).send({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    res.status(200).send({
      success: true,
      client,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


/**
 * GET /api/v1/client/usages/{email}
 * @tags Client
 * @summary Obtiene registros de uso por la dirección de correo electrónico del cliente
 * @param {string} email.path - Dirección de correo electrónico del cliente
 * @return {object} 200 - success response
 * @return {object} 404 - Not found response
 */
ClientRouter.get("/usages/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Buscar el cliente por su dirección de correo electrónico
    const client = await clientSchema.findOne({ email });

    if (!client) {
      return res.status(404).send({
        success: false,
        message: "Cliente no encontrado",
      });
    }
    console.log(client);
    // Buscar los registros de uso relacionados a la membresía del cliente
    const memberships = await MembershipByUserSchema.find({
      clientID: client._id,
    });
    console.log(memberships);
    const usagePromises = memberships.map(async (membership) => {
      return await UsageSchema.find({
        membershipByUserID: membership._id,
      });
    });

    const usageResults = await Promise.all(usagePromises);
    const usages = usageResults.flat();
    console.log(usages);
    res.status(200).send({
      success: true,
      usages,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = ClientRouter


