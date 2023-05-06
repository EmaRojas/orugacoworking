const express = require("express");
const Reservation = require("../models/reservation");
const reservation = require("../models/reservation");
const ReservationRouter = express.Router();


ReservationRouter.post("/", async (req,res) => {
    try {
        const {client, privateRoom, payment} = req.body;
console.log(client,privateRoom,payment);
        if (!client || !privateRoom || !payment) {
          console.log("sin datos");
            return res.status(400).send({
                success:false,
                message: "Faltan datos de completar"
            });
        }

        let reservation = new Reservation({
           client,
           privateRoom,
           payment
        });

        await reservation.save();

        return res.status(200).send({
            success:true,
            message: "Reserva creada",
            reservation
        })
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: err.message
          });
    }
});

//get all
ReservationRouter.get("/", async(req,res) => {
    let reservation = await Reservation.find({});
    return res.status(200).send({
        success:true,
        reservation
    });
});

//update
ReservationRouter.put("/update/:id", async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const { ...data} = req.body;
  
    let reservation = await Reservation.findByIdAndUpdate(id, data, {new:true});
  
    res.status(200).send({
      success:true,
      message: "Reserva modificada!",
      reservation
    });
  });

  ReservationRouter.delete("/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Reservation.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message: "Reserva eliminada!",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  });
  
  

module.exports = ReservationRouter;