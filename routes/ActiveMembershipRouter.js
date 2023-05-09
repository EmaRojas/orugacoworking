const express = require("express");
const ActiveMembership = require("../models/active_membership")
const ActiveMembershipRouter = express.Router();


ActiveMembershipRouter.post("/", async (req,res) => {
    try {
        const {client, membership, payment, availableHours, startDate} = req.body;

        if (!client || ! membership || !payment || !availableHours || startDate) {
            return res.status(400).send({
                success:false,
                message: "Faltan datos de completar"
            });
        }

        let activeMembership = new ActiveMembership({
           client,
           membership,
           payment,
           availableHours,
           startDate
        });

        await activeMembership.save();

        return res.status(200).send({
            success:true,
            message: "Membresía activa",
            activeMembership
        })
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: err.message
          });
    }
});

//get all
ActiveMembershipRouter.get("/", async(req,res) => {
    let activeMembership = await ActiveMembership.find({});
    return res.status(200).send({
        success:true,
        activeMembership
    });
});

//update
ActiveMembershipRouter.put("/update/:id", async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const { ...data} = req.body;
  
    let activeMembership = await ActiveMembership.findByIdAndUpdate(id, data, {new:true});
  
    res.status(200).send({
      success:true,
      message: "Membresía modificada!",
      activeMembership
    });
  });

  ActiveMembershipRouter.delete("/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await ActiveMembership.findByIdAndDelete(id);
      res.status(200).send({
        success: true,
        message: "Membresía eliminada!",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  });
  
  

module.exports = ActiveMembershipRouter;