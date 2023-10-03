const express = require("express");
const MembershipByUserSchema = require("../models/membershipByUser");
const MembershipByUserRouter = express.Router();
const PaymentSchema = require("../models/payment");
const ClientSchema = require("../models/client");
const usageSchema = require("../models/usage");


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

      const dateUtc = new Date();
      const difference = -3; // ART está UTC-3
      const dateArgentina = new Date(dateUtc.getTime() + difference * 60 * 60 * 1000);


      // Crear el objeto de pago
      const payment = new PaymentSchema({
        means_of_payment: req.body.means_of_payment,
        total: req.body.total,
        paid: req.body.paid,                            
        status: 'Pagado',
        created: dateArgentina,
        billing: req.body.billing
      });
  
      // Guardar el pago en la base de datos
      await payment.save();

      // Crear el objeto de reservation
      const membershipByUser = new MembershipByUserSchema({
        clientID: req.body.clientID,
        membershipID: req.body.membershipID,
        roomID: req.body.roomID,
        created: dateArgentina,
        paymentID: payment._id,
        status: 'Activa', 
        total_hours: req.body.hours * 3600,
        remaining_hours: req.body.hours * 3600,
        billing: req.body.billing,
        total: req.body.total,
        paid: req.body.paid
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
  let membershipsByUser = await MembershipByUserSchema.find({ status: "Activa" }).populate('clientID').populate('membershipID').populate('paymentID').populate('roomID');
  return res.status(200).send({
    success: true,
    membershipsByUser
  });
});


/**
 * @typedef {object} MembershipByUser
 * @property {string} hours.required
 */
/**
 * POST /api/v1/membershipByUser/useHours/{id}
 * @tags MembershipByUser
 * @summary Descontar horas
 * @param {string} id.path - id
 * @param {MembershipByUser} request.body.required
 * @return {object} 200 - song response
 */
MembershipByUserRouter.post("/useHours/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let { hours } = req.body;
    
    // Convertir horas y minutos a segundos
    function convertToSeconds(hours, minutes) {
      const totalSeconds = (hours * 3600) + (minutes * 60);
      return totalSeconds;
    }

    

    const decimalNumber = parseFloat(hours);

    const integerPart = Math.floor(decimalNumber);

    const decimalPart = (decimalNumber % 1).toFixed(2);
    const decimalDigits = decimalPart.substring(2);

    const totalSeconds = convertToSeconds(integerPart, decimalDigits);

    let membershipByUser = await MembershipByUserSchema.findById(id);

    if (!membershipByUser) {
      return res.status(404).send({
        success: false,
        message: "MembershipByUser not found"
      });
    }

    if(totalSeconds >= membershipByUser.remaining_hours) {
      membershipByUser.remaining_hours = 0;
      membershipByUser.status = 'Finalizada'
    }
    else {
      membershipByUser.remaining_hours -= totalSeconds;
    }
    

    // Guarda el objeto actualizado en la base de datos
    await membershipByUser.save();

    return res.status(200).send({
      success: true,
      membershipByUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error"
    });
  }
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

    const usages = await usageSchema.find({}).populate('membershipByUserID');

    // Itera sobre todas las priceRooms y elimina las que tengan el roomID especificado
    for (const usage of usages) {
      if (usage.membershipByUserID._id.toString() === id) {
        await usageSchema.findByIdAndDelete(usage._id);
      }
    }

    // Obtener la entrada de MembershipByUser para obtener el paymentID
    const membershipByUser = await MembershipByUserSchema.findById(id);
    if (!membershipByUser) {
      return res.status(404).send({
        success: false,
        message: "Entrada de membresía por usuario no encontrada",
      });
    }

    const paymentId = membershipByUser.paymentID;

    // Eliminar la entrada de MembershipByUser
    await MembershipByUserSchema.findByIdAndDelete(id);

    // Si se encontró un paymentId, eliminar el pago asociado
    if (paymentId) {
      await PaymentSchema.findByIdAndDelete(paymentId);
    }

    res.status(200).send({
      success: true,
      message: "Membresía por usuario eliminada junto con el pago asociado",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


/**
 * GET /api/v1/membershipByUser/client/{email}
 * @tags MembershipByUser
 * @summary Obtiene membresías por la dirección de correo electrónico del cliente
 * @param {string} email.path - Dirección de correo electrónico del cliente
 * @return {object} 200 - success response
 * @return {object} 404 - Not found response
 */
MembershipByUserRouter.get("/client/:email", async (req, res) => {
  try {
    const { email } = req.params;

    // Buscar el cliente por su dirección de correo electrónico
    const client = await ClientSchema.findOne({ email });

    if (!client) {
      return res.status(404).send({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    // Buscar las membresías por el ID del cliente
    const memberships = await MembershipByUserSchema.find({
      clientID: client._id,
    }).populate("membershipID").populate("paymentID").populate("roomID");

    res.status(200).send({
      success: true,
      memberships,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = MembershipByUserRouter


