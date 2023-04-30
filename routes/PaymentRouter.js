const express = require("express");
const Payment = require("../models/payment")
const PaymentRouter = express.Router();


PaymentRouter.post("/payment", async (req,res) => {
    try {
        const {total, means_of_payment, paid, status} = req.body;

        if (!total || ! means_of_payment || !paid || !status) {
            return res.status(400).send({
                success:false,
                message: "Faltan datos de completar"
            });
        }

        let payment = new Payment({
            means_of_payment,
            total,
            paid,
            status
        });

        await payment.save();

        return res.status(200).send({
            success:true,
            message: "Pago creado",
            payment
        })
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: err.message
          });
    }
});

//get all
PaymentRouter.get("/", async(req,res) => {
    let payments = await Payment.find({});
    return res.status(200).send({
        success:true,
        payments
    });
});

//update
PaymentRouter.put("/update/:id", async (req, res) => {
    console.log(req.body);
    const { id } = req.params;
    const { ...data} = req.body;
  
    let payment = await Payment.findByIdAndUpdate(id, data, {new:true});
  
    res.status(200).send({
      success:true,
      message: "Pago modificado!",
      payment
    });
  });

  PaymentRouter.delete("/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Payment.findByIdAndDelete(id);
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
  
  

module.exports = PaymentRouter;