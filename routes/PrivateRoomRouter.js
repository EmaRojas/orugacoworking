const express = require("express");
const PrivateRoom = require("../models/private_room")
const PrivateRoomRouter = express.Router();


PrivateRoomRouter.post("/", async (req,res) => {
    try {
        const {name, capacity} = req.body;

        if (!name || !capacity) {
            return res.status(400).send({
                success:false,
                message: "Faltan datos de completar"
            });
        }

        let privateRoom = new PrivateRoom({
           name,
           capacity
        });

        await privateRoom.save();

        return res.status(200).send({
            success:true,
            message: "Sala creada",
            privateRoom
        })
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: err.message
          });
    }
});

//get all
PrivateRoomRouter.get("/", async(req,res) => {
    let privateRooms = await PrivateRoom.find({});
    return res.status(200).send({
        success:true,
        privateRooms
    });
});

//update
PrivateRoomRouter.put("/update/:id", async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const { ...data} = req.body;
  
    let privateRoom = await PrivateRoom.findByIdAndUpdate(id, data, {new:true});
  
    res.status(200).send({
      success:true,
      message: "Sala modificada!",
      privateRoom
    });
  });

  PrivateRoomRouter.delete("/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await PrivateRoom.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message: "Sala eliminada!",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  });
  
  

module.exports = PrivateRoomRouter;