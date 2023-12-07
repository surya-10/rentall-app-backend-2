import express from "express";
import bcrypt from "bcrypt";
import { addUser, findUser, generateToken, getAllUser, updateUserPassword } from "../userRoutes/userRouter.js";

let userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
    try {
        let { username, password, email } = req.body;
        // console.log(req.body);
        if (!username || !password || !email) {
            return res.status(400).json({ msg: "Fill all details to sign up", status:400, resp:false })
        }
        let checkEmail = await findUser(email);
        if (checkEmail) {
            return res.status(400).json({ msg: "This is email already registered", status:400, resp:false })
        }
        let saltValue = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, saltValue);
        req.body.password = hashedPassword;
        let result = await addUser(req.body)
        return res.status(201).json({status:201, resp:true, msg:"success"});

    } catch (error) {
        return res.status(500).json({ msg: "server error", status: 500 });
    }
})
userRouter.post("/login", async(req, res)=>{
    try {
        let {email, password} = req.body;
        if(!password || !email){
            return res.status(400).json({msg:"required", status:400, resp:false})
        }
        let findAccount = await findUser(email);
        if(!findAccount){
            return res.status(400).json({msg:"not found", status:400, resp:false})
        }
        let pasCheck = await bcrypt.compare(password, findAccount.password);
        if(!pasCheck){
            return res.status(400).json({msg:"incorrect", status:400, resp:false})
        }
        let gentoken = await generateToken(findAccount._id);
        return res.status(201).json({resp:true, token:gentoken, username:findAccount.username, status:200, msg:"success", name:findAccount.username, userId:findAccount._id});

    } catch (error) {
        return res.status(500).send("server error");
    }
})
userRouter.get("/users", async(req, res)=>{
    try {
        let users = await getAllUser();
        return res.status(400).json({res:true, data:users});
    } catch (error) {
        return res.status(500).send("server error");
    }
});

userRouter.post("/forgot", async(req, res)=>{
    try {
        let {email} = req.body;
        let findAccount = await findUser(email);
        if(!findAccount){
            return res.status(400).json({resp:false, status:400, msg:"not exist"});
        }
        return res.status(200).json({resp:true, msg:"exist", status:200, myID:findAccount._id});
    } catch (error) {
        return res.status(500).send("server error");
    }
})

userRouter.post("/update/:id", async(req, res)=>{
    try {
        let {password} = req.body;
        let {id} = req.params;
        let saltValue = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, saltValue);
        let updatePass = await updateUserPassword(id, hashedPassword);
        if(updatePass.acknowledged){
            return res.status(201).json({status:201, msg:"updated"});
        }

    } catch (error) {
        return res.status(500).send("server error");
    }
})

export default userRouter;