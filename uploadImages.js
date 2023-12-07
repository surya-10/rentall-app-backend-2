import express from "express";
import { client } from "./db.js";
import multer from "multer";
import { Binary } from "mongodb";
import { checkEndDate, findUserAndUpdate, getAllImageTrail } from "./control.js";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
// let kwy = process.env.scret_key
// console.log(kwy)
// let stripe = new Stripe(process.env.scret_key);
// console.log(stripe);

let imagesRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// imagesRouter.post("/add", upload.single("image"), async (req, res) => {
//     try {

//         let img = req.file.buffer;
//         let binaryPhto = new Binary(img);
//         const db = client.db('rental-app'); // Replace with your actual database name
//         const collection = db.collection('images');

//         const result = await collection.insertOne({
//             image:binaryPhto
//         });

//         console.log('Image uploaded:', result);
//         res.json({ success: true, message: 'Image uploaded successfully' });
//     } catch (error) {
//         return res.status(500).json({ status: 500, msg: "server error" });
//     }
// })

imagesRouter.get("/all", async(req, res)=>{
    try {
        let images = await getAllImageTrail();
        return res.json({data:images});
    } catch (error) {
        return res.status(500).json({ status: 500, msg: "server error" });
    }
})

// imagesRouter.post("/add/:id", async(req, res)=>{
//     try {
//         let id = req.params;
//         let {bookedStatus, condition, endDate, fuelType, mileage, name, price, rate, startDate, weight} = req.body;
//         let updateData = await updateBikeData(bookedStatus, condition, endDate, fuelType, mileage, name, price, rate, startDate, weight, id);
//         if(updateBikeData){
//             return res.status(200).json({msg:"success"});
//         }
//     } catch (error) {
//         return res.status(500).json({ status: 500, msg: "server error" });
//     }
// })

// imagesRouter.post("/bike", async(req, res)=>{
//     try {
//         let {bookedStatus, condition, endDate, fuelType, mileage, name, price, rate, startDate, weight, priceType, link} = req.body;
//         let updateData = await updateBikeData(bookedStatus, condition, endDate, fuelType, mileage, name, price, rate, startDate, weight, priceType, link);
//         if(updateBikeData){
//             return res.status(200).json({msg:"success"});
//        }
//     } catch (error) {
//         return res.status(500).json({ status: 500, msg: "server error" });
//     }
// })

imagesRouter.post("/booking/:id", async(req, res)=>{
    try {
        let {id} = req.params;
        let {startDate, endDate, days, price, bookedUserId} = req.body;
        // calculateDay(startDate, endDate);
        let updatestatus = await findUserAndUpdate(id, startDate, endDate, price, days, bookedUserId);
        if(updatestatus.acknowledged){
            return res.status(200).json({msg:"updated", resp:true, id:id, price:price});
        }

    } catch (error) {
        return res.status(500).json({ status: 500, msg: "server error" });
    }
})
// imagesRouter.post("/booking/payment-page/user-pay/:id", async(req, res)=>{
//     try {
//         let bike  = req.body;
//         // let totPrice = +price;
//         let {id} = req.params;
//         // console.log(id)
//         // totPrice = totPrice*100;
//         // console.log(bike);
//         let lineItems = bike.map((prod)=>({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     product_name:prod.name
//                 },
//                 unit_amount:prod.priceDetail*100
//             },
//             quantity:prod.quantity
//         }))
//         console.log(typeof(lineItems));
//         const session = await Stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: lineItems,
//             mode: "payment",
//             success_url: "http://localhost:3000/success",
//             cancel_url: "http://localhost:3000/cancel"
//         });
        
//           console.log(session)
//         return res.json({
//             id: session.id
//           });

//     } catch (error) {
//         return res.status(500).json({ status: 500, msg: "server error" });
//     }
// })

setInterval(async ()=>{
    let allBikes = await getAllImageTrail()
    // console.log(allBikes)
    let checkRental = await checkEndDate(allBikes);
}, 432000000)

export default imagesRouter;