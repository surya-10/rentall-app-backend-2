import jwt from "jsonwebtoken";

export function isAuth(req, res, next){
    let tok = req.headers["auth-token"];
    console.log(tok)
    try {
        let myToken = req.headers["auth-token"];
        console.log(myToken)
        if (!myToken) {
            return res.status(400).send({ response: false, message: "Authentication failed", token:false });
        }
        let result = jwt.verify(myToken, "developer");
        next();

    } catch (error) {
        return res.status(500).json({token:null, response:false})
    }
}

