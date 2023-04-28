const express = require("express");
const Client = require("../models/client")
const ClientRouter = express.Router();


ClientRouter.get("/", async(req,res) => {
  let clients = await Client.find({})
  return res.status(200).send({
    success:true,
    clients,
  });
});

ClientRouter.post("/client", async (req,res)=>{
  try{
      const {name}= req.body;
      console.log(req.body);
      console.log(name);
      if(!name)
      {
        return res.status(400).send({
          success:false,
          message:"Faltan datos"
        });
      }

      let client = new Client({
        name
      });

      await client.save()

      return res.status(200).send({
        success:true,
        message: "Cliente Creado",
        client
      });

  }catch(err){
    return res.status(500).send({
      success:false,
      message: err.message
    });
  }
});

module.exports = ClientRouter

// router.get("/", async (req, res, next) => {
//   return res.status(200).json({
//     title: "Express Testing",
//     message: "The app is working properly!",
//   });
// });

// module.exports = router;
