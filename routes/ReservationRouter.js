const express = require("express");
const ReservationSchema = require("../models/reservation");
const MembershipByUserSchema = require("../models/membershipByUser");

const ReservationRouter = express.Router();
// var moment = require('moment-timezone');
// moment().tz("America/Buenos_Aires").format();

/**
 * @typedef {object} Reservation
 * @property {string} clientID.requiere
 * @property {string} roomID.required
 * @property {string} priceRoomID
 * @property {string} date.required
 */
/**
 * POST /api/v1/reservation
 * @tags Reservation
 * @summary Crear nueva reserva
 * @param {Reservation} request.body.required
 * @return {object} 200 - song response
 */
ReservationRouter.post("/", async (req, res) => {
  const reservation = ReservationSchema(req.body);

  if (!reservation.clientID) {
    return res.status(400).send({
      success: false,
      message: "Faltan datos de completar"
    });
  }

  console.log(req.body);

  // Crear el objeto de reservation
  const reserva = new ReservationSchema({
    clientID: req.body.clientID,
    room: req.body.room,
    startDateTime: req.body.startDateTime,
    endDateTime: req.body.endDateTime,
    date: req.body.date,
    dateString: req.body.dateString,
    time: req.body.time,
    endTime: req.body.endTime,
    paymentMethod: req.body.paymentMethod,
    total: req.body.total,
    paid: req.body.paid,
    billing: req.body.billing,
    note: req.body.note
  });

  // Guardar la reserva en la base de datos
  await reserva.save()
    .then((data) => res.status(200).send({
      success: true,
      data
    }))
    .catch((error) => res.status(500).send({
      success: false,
      message: error.message,
    }));

});


/**
 * POST /api/v1/reservation
 * @tags Reservation
 * @summary Crear nueva reserva
 * @param {Reservation} request.body.required
 * @return {object} 200 - song response
 */
ReservationRouter.post("/createMembership", async (req, res) => {
  const reservation = ReservationSchema(req.body);

  if (!reservation.clientID) {
    return res.status(400).send({
      success: false,
      message: "Faltan datos de completar"
    });
  }

  if (reservation.membershipID) {
    // Buscar las membresías por el ID del cliente
    const membershipByUser = await MembershipByUserSchema.findOne({
      _id: reservation.membershipID,
      status: 'Activa'
    });

    console.log(membershipByUser);

    // Supongamos que tienes dos fechas en formato estándar de JavaScript
    const startDate = new Date(reservation.startDateTime);
    const endDate = new Date(reservation.endDateTime);
    // Calcular la diferencia de tiempo en milisegundos
    const differenceInMillis = endDate.getTime() - startDate.getTime();

    // Convertir la diferencia de milisegundos a horas y minutos
    const differenceInHours = Math.floor(differenceInMillis / (1000 * 60 * 60));
    const differenceInMinutes = Math.floor((differenceInMillis % (1000 * 60 * 60)) / (1000 * 60));

    // Formato para expresar la diferencia en el formato que mencionaste (X.Y)
    const formattedDifference = parseFloat(`${differenceInHours}.${differenceInMinutes}`).toFixed(1);

    console.log(formattedDifference);
    console.log(membershipByUser);
    // Convertir horas y minutos a segundos
    function convertToSeconds(hours, minutes) {
      const totalSeconds = (hours * 3600) + (minutes * 60);
      return totalSeconds;
    }

    const decimalNumber = parseFloat(formattedDifference);
    const integerPart = Math.floor(decimalNumber);
    const decimalPart = (decimalNumber % 1).toFixed(2);
    const decimalDigits = decimalPart.substring(2);

    const totalSeconds = convertToSeconds(integerPart, decimalDigits);
    console.log(totalSeconds);

    membershipByUser.remaining_hours = membershipByUser.remaining_hours - totalSeconds;
    await membershipByUser.save();
    console.log('¡Membresía actualizada correctamente!');
  }

  console.log(req.body);

  // Crear el objeto de reservation
  const reserva = new ReservationSchema({
    clientID: req.body.clientID,
    membershipID: req.body.membershipID,
    room: req.body.room,
    startDateTime: req.body.startDateTime,
    endDateTime: req.body.endDateTime,
    date: req.body.date,
    dateString: req.body.dateString,
    time: req.body.time,
    endTime: req.body.endTime,
    paymentMethod: req.body.paymentMethod,
    total: req.body.total,
    paid: req.body.paid,
    billing: req.body.billing,
    note: req.body.note
  });

  // Guardar la reserva en la base de datos
  await reserva.save()
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
 * GET /api/v1/reservation
 * @tags Reservation
 * @summary Obtiene todas las reservas
 * @return {string} 200 - success response
 * @return {object} 400 - Bad request response
 */
ReservationRouter.get("/", async (req, res) => {
  let reservations = await ReservationSchema.find({}).populate('clientID').sort({ dateTime: 1 });
  return res.status(200).send({
    success: true,
    reservations
  });
});

//update
/**
 * @typedef {object} Reservation
* @property {string} clientID.requiere
 * @property {string} roomID.required
 * @property {string} priceRoomID
 * @property {string} paymentID
 * @property {string} date.required
 */
/**
 * PUT /api/v1/reservation/{id}
 * @tags Reservation
 * @summary Actualizar reserva
 * @param {string} id.path - id
 * @param {Reservation} request.body.required
 * @return {string} 200 - success response
 */
ReservationRouter.put("/:id", async (req, res) => {
  const { id } = req.params;

  // Obtener la entrada de MembershipByUser para obtener el paymentID
  const reservation = await ReservationSchema.findById(id);
  if (!reservation) {
    return res.status(404).send({
      success: false,
      message: "Entrada de membresía por usuario no encontrada",
    });
  }

  console.log(req.body);

  reservation.room = req.body.room;
  reservation.startDateTime = req.body.startDateTime;
  reservation.endDateTime = req.body.endDateTime;
  reservation.date = req.body.date;
  reservation.dateString = req.body.dateString;
  reservation.time = req.body.time;
  reservation.endTime = req.body.endTime;
  reservation.paymentMethod = req.body.paymentMethod;
  reservation.total = req.body.total;
  reservation.paid = req.body.paid;
  reservation.billing = req.body.billing;
  reservation.note = req.body.note;


  // Guardar el pago en la base de datos
  await reservation.save();


  res.status(200).send({
    success: true,
    message: "Reserva modificado!",
    reservation
  });
});

/**
 * PUT /api/v1/reservation/membership/{id}
 * @tags Reservation
 * @summary Actualizar reserva membresia
 * @param {string} id.path - id
 * @param {Reservation} request.body.required
 * @return {string} 200 - success response
 */
ReservationRouter.put("/membership/:id", async (req, res) => {
  const { id } = req.params;

  // Obtener la entrada de MembershipByUser para obtener el paymentID
  const reservation = await ReservationSchema.findById(id);
  if (!reservation) {
    return res.status(404).send({
      success: false,
      message: "Entrada de membresía por usuario no encontrada",
    });
  }

  if (reservation.membershipID) {
    // Buscar las membresías por el ID del cliente
    const membershipByUser = await MembershipByUserSchema.findOne({
      _id: reservation.membershipID,
      status: 'Activa'
    });

  // Supongamos que tienes dos fechas en formato estándar de JavaScript
  const startDate = new Date(reservation.startDateTime);
  const endDate = new Date(reservation.endDateTime);
  // Calcular la diferencia de tiempo en milisegundos
  const differenceInMillis = endDate.getTime() - startDate.getTime();

  // Convertir la diferencia de milisegundos a horas y minutos
  const differenceInHours = Math.floor(differenceInMillis / (1000 * 60 * 60));
  const differenceInMinutes = Math.floor((differenceInMillis % (1000 * 60 * 60)) / (1000 * 60));

  // Formato para expresar la diferencia en el formato que mencionaste (X.Y)
  const formattedDifference = parseFloat(`${differenceInHours}.${differenceInMinutes}`).toFixed(1);

  console.log(formattedDifference);
  console.log(membershipByUser);
  // Convertir horas y minutos a segundos
  function convertToSeconds(hours, minutes) {
    const totalSeconds = (hours * 3600) + (minutes * 60);
    return totalSeconds;
  }

  const decimalNumber = parseFloat(formattedDifference);
  const integerPart = Math.floor(decimalNumber);
  const decimalPart = (decimalNumber % 1).toFixed(2);
  const decimalDigits = decimalPart.substring(2);

  const totalSeconds = convertToSeconds(integerPart, decimalDigits);
  console.log(totalSeconds);

  membershipByUser.remaining_hours = membershipByUser.remaining_hours + totalSeconds;
  await membershipByUser.save();

  // Supongamos que tienes dos fechas en formato estándar de JavaScript
  const startDateReq = new Date(req.body.startDateTime);
  const endDateReq = new Date(req.body.endDateTime);
  // Calcular la diferencia de tiempo en milisegundos
  const differenceInMillisReq = endDateReq.getTime() - startDateReq.getTime();

  // Convertir la diferencia de milisegundos a horas y minutos
  const differenceInHoursReq = Math.floor(differenceInMillisReq / (1000 * 60 * 60));
  const differenceInMinutesReq = Math.floor((differenceInMillisReq % (1000 * 60 * 60)) / (1000 * 60));

  // Formato para expresar la diferencia en el formato que mencionaste (X.Y)
  const formattedDifferenceReq = parseFloat(`${differenceInHoursReq}.${differenceInMinutesReq}`).toFixed(1);

  const decimalNumberReq = parseFloat(formattedDifferenceReq);
  const integerPartReq = Math.floor(decimalNumberReq);
  const decimalPartReq = (decimalNumberReq % 1).toFixed(2);
  const decimalDigitsReq = decimalPartReq.substring(2);

  const totalSecondsReq = convertToSeconds(integerPartReq, decimalDigitsReq);
  console.log(totalSecondsReq);

  membershipByUser.remaining_hours = membershipByUser.remaining_hours - totalSecondsReq;
  await membershipByUser.save();
  }

  reservation.startDateTime = req.body.startDateTime;
  reservation.endDateTime = req.body.endDateTime;
  reservation.date = req.body.date;
  reservation.dateString = req.body.dateString;
  reservation.time = req.body.time;
  reservation.endTime = req.body.endTime;
  reservation.note = req.body.note;

  // Guardar el pago en la base de datos
  await reservation.save();


  res.status(200).send({
    success: true,
    message: "Reserva modificado!",
    reservation
  });
});

/**
 * @typedef {object} Reservation
 * @property {string} clientID.requiere
 * @property {string} roomID.required
 * @property {string} priceRoomID
 * @property {string} date.required /
/*
 * POST /api/v1/reservation/membership
 * @tags Reservation
 * @summary Crear nueva reserva
 * @param {Reservation} request.body.required
 * @return {object} 200 - song response
*/



//get client reservations
/**
 * GET /api/v1/reservation/client/{id}
 * @tags Reservation
 * @summary Obtiene las reservas del cliente
 * @param {string} id.path - id
 * @return {object} 200 - success response
 * @return {object} 400 - Bad request response
 */
ReservationRouter.get("/client/:id", async (req, res) => {
  try {
    const { id } = req.params;

  const reservations = await ReservationSchema.find({
    clientID: id
  })
  .populate("clientID")
  .populate("priceRoomID")
  .populate("paymentID")
  .populate("roomID");

  return res.status(200).send({
    success: true,
    reservations
  });

} catch (error) {
  return res.status(500).send({
  success: false,
  message: "Error obteniendo reservas"
  });
  }
  }); 


/**
 * delete /api/v1/reservation/{id}
 * @tags Reservation
 * @summary Eliminar reserva
 * @param {string} id.path - id
 * @return {string} 200 - success response
 */
ReservationRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener la reserva para obtener el paymentID
    const reservation = await ReservationSchema.findById(id);
    if (!reservation) {
      return res.status(404).send({
        success: false,
        message: "Reserva no encontrada",
      });
    }


    if (reservation.membershipID) {
      // Buscar las membresías por el ID del cliente
      const membershipByUser = await MembershipByUserSchema.findOne({
        _id: reservation.membershipID,
        status: 'Activa'
      });

      console.log(membershipByUser);

      // Supongamos que tienes dos fechas en formato estándar de JavaScript
      const startDate = new Date(reservation.startDateTime);
      const endDate = new Date(reservation.endDateTime);
      // Calcular la diferencia de tiempo en milisegundos
      const differenceInMillis = endDate.getTime() - startDate.getTime();

      // Convertir la diferencia de milisegundos a horas y minutos
      const differenceInHours = Math.floor(differenceInMillis / (1000 * 60 * 60));
      const differenceInMinutes = Math.floor((differenceInMillis % (1000 * 60 * 60)) / (1000 * 60));

      // Formato para expresar la diferencia en el formato que mencionaste (X.Y)
      const formattedDifference = parseFloat(`${differenceInHours}.${differenceInMinutes}`).toFixed(1);

      console.log(formattedDifference);
      console.log(membershipByUser);
      // Convertir horas y minutos a segundos
      function convertToSeconds(hours, minutes) {
        const totalSeconds = (hours * 3600) + (minutes * 60);
        return totalSeconds;
      }

      const decimalNumber = parseFloat(formattedDifference);
      const integerPart = Math.floor(decimalNumber);
      const decimalPart = (decimalNumber % 1).toFixed(2);
      const decimalDigits = decimalPart.substring(2);

      const totalSeconds = convertToSeconds(integerPart, decimalDigits);
      console.log(totalSeconds);

      membershipByUser.remaining_hours = membershipByUser.remaining_hours + totalSeconds;
      await membershipByUser.save();
      console.log('¡Membresía actualizada correctamente!');
    }

    await ReservationSchema.findByIdAndDelete(id);


    res.status(200).send({
      success: true,
      message: "Reserva eliminada junto con el pago asociado",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


//get today reservations
/**
 * GET /api/v1/reservation/today
 * @tags Reservation
 * @summary Obtiene todas las reservas del dia
 * @return {string} 200 - success response
 * @return {object} 400 - Bad request response
 */
ReservationRouter.get("/today", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Establece las horas, minutos, segundos y milisegundos a cero para obtener el comienzo del día actual
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Establece la fecha al día siguiente para obtener el final del día actual
  
  try {
  const reservations = await ReservationSchema.find({
  dateTime: {
  $gte: today,
  $lt: tomorrow
  }
  })
  .populate("clientID")
  .populate("priceRoomID")
  .populate("paymentID")
  .populate("roomID");

  return res.status(200).send({
    success: true,
    reservations
  });

} catch (error) {
  return res.status(500).send({
  success: false,
  message: "Error obteniendo reservas"
  });
  }
  });


//get all
/**
 * POST /api/v1/reservation/filter
 * @tags Reservation
 * @summary Obtiene todas las reservas filtradas
 * @return {string} 200 - success response
 * @return {object} 400 - Bad request response
 */
ReservationRouter.post("/filter", async (req, res) => {
    
    var startDate = req.body.start;
    var endDate = req.body.end;

    // Consulta para encontrar las reservas dentro del rango de fechas
    const query = {
      startDateTime: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

  let reservations = await ReservationSchema.find(query).populate('clientID').sort({ dateTime: 1 });
  return res.status(200).send({
    success: true,
    reservations
  });
});

ReservationRouter.get("/current", async (req, res) => {

  const dateUtc = new Date();
  const difference = -3; // ART está UTC-3
  const now = new Date(dateUtc.getTime() + difference * 60 * 60 * 1000);

  try {
    const reservations = await ReservationSchema.find({
      startDateTime: { $lte: now }, // La reserva ha comenzado (fecha y hora de inicio es anterior o igual a ahora)
      endDateTime: { $gte: now } // La reserva aún no ha terminado (fecha y hora de fin es posterior o igual a ahora)
    })
    .populate("clientID")


    return res.status(200).send({
      success: true,
      reservations
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error obteniendo reservas"
    });
  }
});

ReservationRouter.post("/filter/stats", async (req, res) => {
  try {
      const startDate = req.body.start;
      const endDate = req.body.end;

      // Consulta para encontrar las reservas dentro del rango de fechas
      const query = {
          dateTime: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
          },
      };

      // Obtener la cantidad total de reservas en el rango horario dado
      const totalReservations = await ReservationSchema.countDocuments(query);

      // Obtener la cantidad de reservas por nombre de sala
      const roomStats = await ReservationSchema.aggregate([
          {
              $match: query,
          },
          {
              $lookup: {
                  from: "rooms", // El nombre de la colección en la base de datos
                  localField: "roomID",
                  foreignField: "_id",
                  as: "roomData",
              },
          },
          {
              $group: {
                  _id: "$roomData.name", // Referencia correcta al nombre de la sala
                  count: { $sum: 1 },
              },
          },
          {
              $project: {
                  roomName: "$_id",
                  count: 1,
                  _id: 0,
              },
          },
      ]);

      return res.status(200).send({
          success: true,
          totalReservations,
          roomStats,
      });
  } catch (error) {
      return res.status(500).send({
          success: false,
          message: "An error occurred while processing your request.",
          error: error.message,
      });
  }
});

ReservationRouter.post("/by-date", async (req, res) => {
  try {
    const { date } = req.body; // Asegúrate de enviar la fecha en el cuerpo de la solicitud como { "date": "2023-09-06" }
    console.log(date);
    // Verifica si la fecha es válida en el formato deseado (yyyy-MM-dd)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).send({
        success: false,
        message: "Formato de fecha no válido. Debe ser yyyy-MM-dd.",
      });
    }

    const reservations = await ReservationSchema.find({
      date: date,
    }).populate("roomID");

    const rooms = {}; // Objeto para almacenar información de salas

    // Inicializa horarios para todas las salas como libres
    reservations.forEach((reservation) => {
      const roomName = reservation.roomID.name;
      if (!rooms[roomName]) {
        rooms[roomName] = {};
        for (let i = 0; i < 24; i++) {
          const timeSlot = i.toString().padStart(2, "0") + "-" + (i + 1).toString().padStart(2, "0");
          rooms[roomName][timeSlot] = "free";
        }
      }
    });

    // Marca los horarios ocupados para cada sala
    reservations.forEach((reservation) => {
      const roomName = reservation.roomID.name;
      const startTime = parseInt(reservation.time.substring(0, 2));
      const endTime = parseInt(reservation.endTime.substring(0, 2));

      for (let i = startTime; i < endTime; i++) {
        const timeSlot = i.toString().padStart(2, "0") + "-" + (i + 1).toString().padStart(2, "0");
        rooms[roomName][timeSlot] = "busy";
      }
    });

    return res.status(200).send({
      success: true,
      rooms,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error obteniendo información de salas",
    });
  }
});
module.exports = ReservationRouter


