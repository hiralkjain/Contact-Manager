const asynchandler = require("express-async-handler");
const User = require("../models/usermodels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc Register a user
// @route GET /api/users/register
// @access public
const registeruser = asynchandler(async (req,res) => {
   const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const useravailable = await User.findOne({email})
    if(useravailable)
    {
        res.status(400);
        throw new Error("User already exists"); 
    }

    const hashpassword = await bcrypt.hash(password,10);
    console.log(hashpassword);
    const user = await User.create({
        username,
        email,
        password: hashpassword,
    });
    console.log("user created",user);
    if(user)
    {
        res.status(201).json({_id: user.id, email:user.email});
    }
    else{
        res.status(400);
        throw new Error("User data not valid"); 
    }
 });



 // @desc Login a user
// @route GET /api/users/login
// @access public
const loginuser = asynchandler(async (req,res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password)))
    {
        const accesstoken = jwt.sign({
            user:{
                username: user.username,
                email: user.email,
                id: user.id,
            },
        },process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2h" });
       // console.log("user login",user);
        res.status(200).json({ accesstoken });
    }
    else {
        res.status(401);
        throw new Error("Invalid Password");
        }
 });



 // @desc Current user info
// @route GET /api/users/currentuser
// @access private
const currentuser = asynchandler(async (req,res) => {
    res.json(req.user);
 });

 module.exports = { registeruser, loginuser , currentuser };