const express = require("express");
const membershipSchema = require("../models/membership");
const MembershipRouter = express.Router();
const MembershipByUserSchema = require("../models/membershipByUser");
const PaymentSchema = require("../models/payment");


/**
 * @typedef {object} Membership
 * @property {string} name.required
 * @property {string} price.required
 * @property {string} type.required
 * @property {string} hours.required
 */
/**
 * POST /api/v1/membership
 * @tags Membership
 * @summary Crear nueva membresia
 * @param {Membership} request.body.required
 * @return {object} 200 - song response
 */
MembershipRouter.post("/", async (req, res) => {
  const membership = membershipSchema(req.body);

  if (!membership.roomID || !membership.type || !membership.hours) {
    return res.status(400).send({
      success: false,
      message: "Faltan datos de completar"
    });
  }

  membership
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
 * GET /api/v1/membership
 * @tags Membership
 * @summary Obtiene todos las membresias
 * @return {string} 200 - success response
 * @return {object} 400 - Bad request response
 */
MembershipRouter.get("/", async (req, res) => {
  let memberships = await membershipSchema.find({});
  return res.status(200).send({
    success: true,
    memberships
  });
});

//update
/**
 * @typedef {object} Membership
 * @property {string} name.required
 * @property {string} price.required
 * @property {string} type.required
 * @property {string} hours.required
 */
/**
 * PUT /api/v1/membership/{id}
 * @tags Membership
 * @summary Actualizar membresia
 * @param {string} id.path - id
 * @param {Membership} request.body.required
 * @return {string} 200 - success response
 */
MembershipRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;

  let membership = await membershipSchema.findByIdAndUpdate(id, data, { new: true });

  res.status(200).send({
    success: true,
    message: "Membresía modificada!",
    membership
  });
});

/**
 * delete /api/v1/membership/{id}
 * @tags Membership
 * @summary Eliminar membresia
 * @param {string} id.path - id
 * @return {string} 200 - success response
 */
MembershipRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    try {
      const membershipsByUser = await MembershipByUserSchema.find({}).populate('membershipID');
    
      // Itera sobre todas las membershipsByUser y elimina las que tengan el membershipID especificado
      for (const membershipByUser of membershipsByUser) {
        if (membershipByUser.membershipID._id.toString() === id) {
          console.log(membershipByUser.membershipID._id.toString());
          await MembershipByUserSchema.findByIdAndDelete(membershipByUser._id);
          const paymentId = membershipByUser.paymentID;
          await PaymentSchema.findByIdAndDelete(paymentId);

        }
      }
    
      console.log('Operación completada con éxito.');
    
    } catch (error) {
      console.error('Error al intentar eliminar registros:', error.message);
    }

    await membershipSchema.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Membresía eliminada!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


module.exports = MembershipRouter


