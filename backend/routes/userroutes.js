const express = require("express");
const { registeruser , loginuser , currentuser } = require("../controller/usercontroller");
const router = express.Router();
const validatetoken = require('../middleware/validtoken');
router.post("/register",registeruser);

router.post("/login",loginuser);
 
router.get("/currentuser",validatetoken,currentuser);

 module.exports = router;