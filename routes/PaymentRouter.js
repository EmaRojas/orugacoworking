const express = require("express");
const paymentSchema = require("../models/payment");
const PaymentRouter = express.Router();


/**
 * @typedef {object} Payment
 * @property {string} means_of_payment.required
 * @property {string} total.required
 * @property {string} paid.required
 * @property {string} status.required
 */
/**
 * POST /api/v1/payment
 * @tags Payment
 * @summary Crear un nuevo cliente
 * @param {Payment} request.body.required
 * @return {object} 200 - payment response
 */
PaymentRouter.post("/", async (req, res) => {
  const payment = paymentSchema(req.body);

  if (!payment.means_of_payment || !payment.total || !payment.paid || !payment.status) {
    return res.status(400).send({
      success: false,
      message: "Faltan datos de completar"
    });
  }

  payment
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
 * GET /api/v1/payment
 * @tags Payment
 * @summary Obtiene todos los pagos
 * @return {string} 200 - success response
 * @return {object} 400 - Bad request response
 */
PaymentRouter.get("/", async (req, res) => {
  debugger
  try {
    const paymentsWithReservations = await paymentSchema.aggregate([
    {
    $lookup: {
    from: 'reservations', // Nombre de la colección de reservas (en minúsculas y plural)
    localField: '_id',
    foreignField: 'paymentID',
    as: 'reservationInfo'
    }
    },
    {
    $unwind: '$reservationInfo'
    },
    {
      $lookup: {
        from: 'clients', // Cambia 'clients' al nombre de tu colección de clientes
        localField: 'reservationInfo.clientID',
        foreignField: '_id',
        as: 'clientInfo'
      }
    },
    {
      $unwind: '$clientInfo'
    }
    ]);

    const paymentsWithMemberships = await paymentSchema.aggregate([
      {
      $lookup: {
      from: 'membershipbyusers', // Nombre de la colección de reservas (en minúsculas y plural)
      localField: '_id',
      foreignField: 'paymentID',
      as: 'membershipInfo'
      }
      },
      {
      $unwind: '$membershipInfo'
      },
      {
        $lookup: {
          from: 'clients', // Cambia 'clients' al nombre de tu colección de clientes
          localField: 'membershipInfo.clientID',
          foreignField: '_id',
          as: 'clientInfo'
        }
      },
      {
        $unwind: '$clientInfo'
      }
      ]);

    const combinedPayments = paymentsWithReservations.concat(paymentsWithMemberships);
    res.json(combinedPayments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los pagos con reservas' });
    }
    });


//   let payments = await paymentSchema.find({});
//   return res.status(200).send({
//     success: true,
//     payments
//   });
// });

//update
/**
 * @typedef {object} Payment
 * @property {string} means_of_payment.required
 * @property {string} total.required
 * @property {string} paid.required
 * @property {string} status.required
 */
/**
 * PUT /api/v1/payment/{id}
 * @tags Payment
 * @summary Actualizar pago
 * @param {string} id.path - id
 * @param {Payment} request.body.required
 * @return {string} 200 - success response
 */
PaymentRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;

  let payment = await paymentSchema.findByIdAndUpdate(id, data, { new: true });

  res.status(200).send({
    success: true,
    message: "Pago modificado!",
    payment
  });
});

/**
 * delete /api/v1/payment/{id}
 * @tags Payment
 * @summary Eliminar pago
 * @param {string} id.path - id
 * @return {string} 200 - success response
 */
PaymentRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await paymentSchema.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Pago eliminado!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


module.exports = PaymentRouter


