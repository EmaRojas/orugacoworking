const express = require("express");
const usageSchema = require("../models/usage");
const UsageRouter = express.Router();


/**
 * @typedef {object} Usage
 * @property {string} membershipByUserID.required
 * @property {string} hour.required
 * @property {string} date.required
 * @property {string} company_name
 */
/**
 * POST /api/v1/usage
 * @tags Usage
 * @summary Crear un nuevo cliente
 * @param {Usage} request.body.required
 * @return {object} 200 - song response
 */
UsageRouter.post("/", async (req, res) => {
  const usage = usageSchema(req.body);

  if (!usage.membershipByUserID || !usage.hour || !usage.date) {
    return res.status(400).send({
      success: false,
      message: "Faltan datos de completar"
    });
  }

  usage
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
 * GET /api/v1/usage
 * @tags Usage
 * @summary Obtiene todos los consumos
 * @return {string} 200 - success response
 * @return {object} 400 - Bad request response
 */
UsageRouter.get("/", async (req, res) => {
  let usages = await usageSchema.find({});
  return res.status(200).send({
    success: true,
    usages
  });
});

//update
/**
 * @typedef {object} Usage
 * @property {string} membershipByUserID.required
 * @property {string} hour.required
 * @property {string} date.required
 * @property {string} company_name
 */
/**
 * PUT /api/v1/usage/{id}
 * @tags Usage
 * @summary Actualizar consumo
 * @param {string} id.path - id
 * @param {Usage} request.body.required
 * @return {string} 200 - success response
 */
UsageRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;

  let usage = await usageSchema.findByIdAndUpdate(id, data, { new: true });

  res.status(200).send({
    success: true,
    message: "Consumo modificado!",
    usage
  });
});

/**
 * delete /api/v1/usage/{id}
 * @tags Usage
 * @summary Eliminar consumo
 * @param {string} id.path - id
 * @return {string} 200 - success response
 */
UsageRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await usageSchema.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Consumo eliminado!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


module.exports = UsageRouter


