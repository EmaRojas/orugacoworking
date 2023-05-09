const express = require("express");
const Hours = require("../models/hours");
const HoursRouter = express.Router();


HoursRouter.post("/", async (req, res) => {
  try {
    const { client, activeMembership, duration} = req.body;

    if (!client || !activeMembership || !duration) {
      return res.status(400).send({
        success: false,
        message: "Faltan datos de completar"
      });
    }

    let hours = new Hours({
     client,
     activeMembership,
     duration
    });

    await hours.save();

    return res.status(200).send({
      success: true,
      message: "Horas Creadas",
      hours
    });

  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message
    });
  }
});

//get all
HoursRouter.get("/", async (req, res) => {
  let hours = await Hours.find({});
  return res.status(200).send({
    success: true,
    hours
  });
});

//update
HoursRouter.put("/update/:id", async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const { ...data} = req.body;

  let hours = await Hours.findByIdAndUpdate(id, data, {new:true});

  res.status(200).send({
    success:true,
    message: "Horas modificado!",
    hours
  });
});

HoursRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Hours.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Horas eliminado!",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


module.exports = HoursRouter


