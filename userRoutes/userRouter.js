import { ObjectId } from "mongodb";
import { client } from "../db.js";
import jwt from "jsonwebtoken";

export function addUser(data){
    return client.db("rental-app").collection("users").insertOne(data)
}
export function findUser(email){
    console.log(email)
    return client.db("rental-app").collection("users").findOne({email:email});
}
export function generateToken(id){
    return jwt.sign({id}, "developer");
}
export function getAllUser(){
    return client.db("rental-app").collection("users").find().toArray();
}
export function updateUserPassword(id, password){
    return client.db("rental-app").collection("users").updateOne({_id:new ObjectId(id)}, {$set:{password:password}});
}