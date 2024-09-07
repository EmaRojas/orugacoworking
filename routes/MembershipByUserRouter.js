const express = require("express");
const MembershipByUserSchema = require("../models/membershipByUser");
const MembershipByUserRouter = express.Router();
const ClientSchema = require("../models/client");
const ReservationSchema = require("../models/reservation");


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
    // Buscar el cliente por su dirección de correo electrónico
    let clientID = req.body.clientID;
    const client = await ClientSchema.findById(clientID);

    console.log(req.body);

    if (!client) {
      return res.status(404).send({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    // Buscar las membresías por el ID del cliente
    const membership = await MembershipByUserSchema.findOne({
      clientID: client._id,
      status: 'Activa'
    });

  if (!req.body.clientID || membership) {
    console.log("ya existe una membresia activa");
    return res.status(400).send({
      success: false,
      message: "Faltan datos de completar"
    });
  } else {
    const dateUtc = new Date();
    const difference = -3; // ART está UTC-3
    const dateArgentina = new Date(dateUtc.getTime() + difference * 60 * 60 * 1000);


    // Crear el objeto de reservation
    const membershipByUser = new MembershipByUserSchema({
      clientID: req.body.clientID,
      room: req.body.room,
      created: dateArgentina,
      status: 'Activa', 
      total_hours: req.body.hours * 3600,
      remaining_hours: req.body.hours * 3600,
      billing: req.body.billing,
      total: req.body.total,
      paid: req.body.paid,
      paymentMethod: req.body.paymentMethod
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
  }
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
  let membershipsByUser = await MembershipByUserSchema.find({ status: "Activa" }).populate('clientID');
  return res.status(200).send({
    success: true,
    membershipsByUser
  });
});


// Endpoint para obtener la suma de 'total' y 'paid' de membresías activas
MembershipByUserRouter.get("/totals", async (req, res) => {
  try {
    const memberships = await MembershipByUserSchema.find({ status: 'Activa' });

    let totalSum = 0;
    let paidSum = 0;

    memberships.forEach(membership => {
      totalSum += parseFloat(membership.total) || 0;
      paidSum += parseFloat(membership.paid) || 0;
    });

    const count = memberships.length;

    res.status(200).send({
      success: true,
      total: totalSum,
      paid: paidSum,
      count: count
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
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

    //let membershipByUser = await MembershipByUserSchema.findById(id);

    // Buscar las membresías por el ID del cliente
    const membershipByUser = await MembershipByUserSchema.findOne({
      _id: id,
      status: 'Activa'
    });

    if (!membershipByUser) {
      return res.status(404).send({
        success: false,
        message: "MembershipByUser not found"
      });
    }

    if(totalSeconds > membershipByUser.remaining_hours) {
      return res.status(404).send({
        success: false,
        message: "No tiene las horas suficientes para hacer esta reserva"
      });
    } else {
      membershipByUser.remaining_hours -= totalSeconds;

      if(totalSeconds >= membershipByUser.remaining_hours) {
        membershipByUser.remaining_hours = 0;
        membershipByUser.status = 'Finalizada'
      }
      // Guarda el objeto actualizado en la base de datos
      await membershipByUser.save();
  
      return res.status(200).send({
        success: true,
        membershipByUser
      });
    }  

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
  
  console.log(req.body);
  const membershipByUser = await MembershipByUserSchema.findById(id);

  if (!membershipByUser) {
    return res.status(404).send({
      success: false,
      message: "Membership not found",
    });
  }

  membershipByUser.total = req.body.total;
  membershipByUser.paid = req.body.paid;
  membershipByUser.billing = req.body.billing;
  membershipByUser.paymentMethod = req.body.paymentMethod;

  try {
    const updatedMembership = await membershipByUser.save();
    
    // Check if the update was successful
    const checkUpdated = await MembershipByUserSchema.findById(id);
    if (JSON.stringify(checkUpdated) === JSON.stringify(updatedMembership)) {
      console.log(`Membership ${id} updated successfully`);
      res.status(200).send({
        success: true,
        data: updatedMembership
      });
    } else {
      console.log(`Membership ${id} update may have failed`);
      res.status(500).send({
        success: false,
        message: "Update may have failed, please verify",
      });
    }
  } catch (error) {
    console.error(`Error updating membership ${id}:`, error.message);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
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
    
    // Delete associated reservations
    const reservations = await ReservationSchema.find({ membershipID: id });
    for (const reservation of reservations) {
      try {
        await ReservationSchema.findByIdAndDelete(reservation._id);
        console.log(`Reservation ${reservation._id} deleted successfully`);
      } catch (error) {
        console.error(`Failed to delete reservation ${reservation._id}:`, error.message);
      }
    }

    // Delete the MembershipByUser
    const deletedMembership = await MembershipByUserSchema.findByIdAndDelete(id);
    
    if (!deletedMembership) {
      console.log(`Membership ${id} not found`);
      return res.status(404).send({
        success: false,
        message: "Entrada de membresía por usuario no encontrada",
      });
    }

    console.log(`Membership ${id} deleted successfully`);

    res.status(200).send({
      success: true,
      message: "Membresía por usuario y reservaciones asociadas eliminadas correctamente",
    });
  } catch (error) {
    console.error(`Error in delete operation:`, error.message);
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
    console.log("Searching for email:", email);

    // Trim the email and convert to lowercase
    const normalizedEmail = email.trim().toLowerCase();

    // Buscar el cliente por su dirección de correo electrónico
    const client = await ClientSchema.findOne({ 
      email: { $regex: new RegExp('^' + normalizedEmail + '$', 'i') } 
    });

    if (client) {
      console.log("Found client with ID:", client._id);
    } else {
      console.log("No client found for email:", normalizedEmail);
      return res.status(404).send({
        success: false,
        message: "Cliente no encontrado",
      });
    }

    // Buscar las membresías por el ID del cliente
    console.log("Searching for memberships with:", { clientID: client._id, status: 'Activa' });
    const memberships = await MembershipByUserSchema.find({
      clientID: client._id,
      status: 'Activa'
    }).populate('clientID');
    console.log("Memberships query result:", memberships);

    res.status(200).send({
      success: true,
      memberships,
    });
  } catch (error) {
    console.error("Error in /client/:email route:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = MembershipByUserRouter


