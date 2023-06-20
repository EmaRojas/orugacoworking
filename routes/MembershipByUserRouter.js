const express = require("express");
const MembershipByUserSchema = require("../models/membershipByUser");
const MembershipByUserRouter = express.Router();


/**
 * @typedef {object} MembershipByUser
 * @property {string} clientID.required
 * @property {string} membershipID.required
 * @property {string} paymentID.required
 * @property {string} startDate.required
 * @property {string} endDate.required
 */
/**
 * POST /api/v1/membershipByUser
 * @tags MembershipByUser
 * @summary Crear nueva membresía por usuario
 * @param {MembershipByUser} request.body.required
 * @return {object} 200 - song response
 */
MembershipByUserRouter.post("/", async (req, res) => {

  if (!req.body.clientID || !req.body.membershipID) {
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
      const membershipByUser = new MembershipByUserSchema({
        clientID: req.body.clientID,
        membershipID: req.body.membershipID,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        paymentID: payment._id
      });

      await membershipByUser.save()
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
 * GET /api/v1/membershipByUser
 * @tags MembershipByUser
 * @summary Obtiene todas las membresias por usuario
 * @return {string} 200 - success response
 * @return {object} 400 - Bad request response
 */
MembershipByUserRouter.get("/", async (req, res) => {
  let membershipsByUser = await MembershipByUserSchema.find({}).populate('clientID').populate('membershipID').populate('paymentID');
  return res.status(200).send({
    success: true,
    membershipsByUser
  });
});

//update
/**
 * @typedef {object} MembershipByUser
 * @property {string} clientID.required
 * @property {string} membershipID.required
 * @property {string} paymentID.required
 * @property {string} startDate.required
 * @property {string} endDate.required
 */
/**
 * PUT /api/v1/membershipByUser/{id}
 * @tags MembershipByUser
 * @summary Actualizar membresia
 * @param {string} id.path - id
 * @param {MembershipByUser} request.body.required
 * @return {string} 200 - success response
 */
MembershipByUserRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;

  let membershipByUser = await MembershipByUserSchema.findByIdAndUpdate(id, data, { new: true });

  res.status(200).send({
    success: true,
    message: "Membresía modificado!",
    membershipByUser
  });
});

/**
 * delete /api/v1/membershipByUser/{id}
 * @tags MembershipByUser
 * @summary Eliminar membresía
 * @param {string} id.path - id
 * @return {string} 200 - success response
 */
MembershipByUserRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await MembershipByUserSchema.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Membresía eliminado!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


module.exports = MembershipByUserRouter


