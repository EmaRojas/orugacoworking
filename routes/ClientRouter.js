const express = require("express");
const Client = require("../models/client");
const ClientRouter = express.Router();


ClientRouter.post("/client", async (req, res) => {
  try {
    const { full_name, phone, email, company_name, cuit, description, assistance } = req.body;

    if (!full_name || !phone || !email || !company_name || !cuit || !description || !assistance) {
      return res.status(400).send({
        success: false,
        message: "Faltan datos de completar"
      });
    }

    let client = new Client({
      full_name,
      phone,
      email,
      company_name,
      cuit,
      description,
      assistance
    });

    await client.save();

    return res.status(200).send({
      success: true,
      message: "Cliente Creado",
      client
    });

  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message
    });
  }
});

//get all
ClientRouter.get("/", async (req, res) => {
  let clients = await Client.find({});
  return res.status(200).send({
    success: true,
    clients
  });
});

//update
ClientRouter.put("/update/:id", async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const { ...data} = req.body;

  let client = await Client.findByIdAndUpdate(id, data, {new:true});

  res.status(200).send({
    success:true,
    message: "Cliente modificado!",
    client
  });
});

ClientRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Client.findByIdAndDelete(id);
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


module.exports = ClientRouter


