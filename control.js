import { ObjectId } from "mongodb";
import { client } from "./db.js";

// export async function getAllImages(){
//     console.log("hi")
//     let users = await client.db("rental-app").collection("images").find().toArray();
//     console.log(users)
//     let baseurl = users.map((user)=>{
//         return {
//             ...user, 
//             image:user.image ? user.image.toString('base64') : null,
//         }
//     })
//     // console.log(baseurl);
//     return baseurl;
// }
export async function getAllImageTrail() {
    return client.db("rental-app").collection("images").find().toArray();
}
// export async function updateBikeData(bookedStatus, condition, endDate, fuelType, mileage, name, price, rate, startDate, weight, priceType, link){
//     return client.db("rental-app").collection("images").insertOne({bookedStatus:bookedStatus, condition:condition, endDate:endDate, fuelType:fuelType, mileage:mileage, name:name, price:price, rate:rate, startDate:startDate, weight:weight, priceType:priceType, link:link})
// }

export async function findUserAndUpdate(id, startDate, endDate, price, days, bookedUserId) {
    let result = await client.db("rental-app").collection("images").updateOne({ _id: new ObjectId(id) }, { $set: { price: price, startDate: startDate, endDate: endDate, bookedStatus: true, bookedDays: days, bookedUserId:bookedUserId } });
    return result;
}
export function checkEndDate(datas) {
    for (let data of datas) {
        // console.log(data.endDate)
        if(data.endDate){
        const dateObject = new Date(data.endDate);
        // console.log(dateObject)
        const formattedDate = dateObject.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        let todayDate = new Date();
        const todayFormattedDate = todayDate.toLocaleDateString("en-GB", {
            day:"2-digit",
            month:"2-digit",
            year:"numeric"
        })
        // console.log("format", formattedDate);
        // console.log("today", todayFormattedDate);
        let changeFormat1 = formattedDate.split("/");

        const date1 = new Date(`${changeFormat1[2]}-${changeFormat1[1]}-${changeFormat1[0]}`);
        let changeFormat2 = todayFormattedDate.split("/");
        const date2 = new Date(`${changeFormat2[2]}-${changeFormat2[1]}-${changeFormat2[0]}`);
        if(date2>date1){
             changeBikeStatus(data._id);
        }
    }
    }
}
async function changeBikeStatus(id){
   let a = await client.db("rental-app").collection("images").updateOne({ _id: new ObjectId(id) }, { $set: { price: 0, startDate: "", endDate: "", bookedStatus: false, bookedDays: 0, bookedUserId:"" } });
}
