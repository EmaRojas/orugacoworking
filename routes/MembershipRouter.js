const express = require("express");
const Membership = require("../models/membership")
const MembershipRouter = express.Router();

//get all memberships
MembershipRouter.get("/", async (req, res) => {
    let memberships = await Membership.find({})
    return res.status(200).send({
        success: true,
        memberships,
    });
    //res.json({ user: 'geek' });
});

//get membership by id
MembershipRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
  
    let membership = await Membership.findById(id);
  
    if (!membership) res.status(404).send({
        success:false,
        message: "Membresía no encontrada"
    });

    else res.status(200).send({
      success:true,
      message: "Membresía obtenida",
      membership
    });
  });

//create membership
MembershipRouter.post("/", async (req, res) => {
    try {
      const { name, price, type } = req.body;
      console.log(req.body);
      if (!name || !price || !type) {
        return res.status(400).send({
          success: false,
          message: "Faltan datos de completar"
        });
      }
  
      let membership = new Membership({
        name,
        price,
        type
      });
  
      await membership.save()
  
      return res.status(200).send({
        success: true,
        message: "Membresía creada",
        membership
      });
  
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: err.message
      });
    }
  });

//update membership
MembershipRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { ...data} = req.body;
  
    let membership = await Membership.findByIdAndUpdate(id, data, {new:true});
  
    res.status(200).send({
      success:true,
      message: "Membresía modificada!",
      membership
    });
  });

//delete membership
MembershipRouter.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Membership.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message: "Membersía eliminada!",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  });
  
module.exports = MembershipRouter