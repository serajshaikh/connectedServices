import { Router } from "express";
import { userController } from "../controller/userController";
const router=Router();

router.get("/",(req,res)=>{
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.send("Hi You are in home route...")
});

router.post('/save',async (req, res) =>{
    // console.log('Got body:', req.body);
    const database = await userController.apiCall(JSON.stringify(req.body));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(req.body));
})

export default {router}