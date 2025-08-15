const asynchandler = require("express-async-handler");
const Contacts = require("../models/contactmodels");

// @desc Get all contacts
// @route GET /api/contacts
// @access private
const getcontacts = asynchandler(async (req, res) => {
    const contacts = await Contacts.find({ user_id: req.user.id });
    console.log(req.user.id);
    res.status(200).json(contacts);
});

// @desc Create contact
// @route POST /api/contacts
// @access private
const createcontact = asynchandler(async (req, res) => {
    const { name, phone } = req.body;

    if (!name || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const contact = await Contacts.create({
        name,
        phone,
        user_id: req.user.id,
    });

    res.status(201).json(contact);
});

// @desc Get a contact
// @route GET /api/contacts/:id
// @access private
const getcontact = asynchandler(async (req, res) => {
    const contact = await Contacts.findById(req.params.id);
    if(!contact)
    {
        res.status(404);
        throw new error("No contact found!");
    }
   
    console.log(contact.name);
    res.json(contact);
});

// @desc Update a contact
// @route PUT /api/contacts/:id
// @access private
const updatecontact = asynchandler(async (req, res) => {
    const contact = await Contacts.findById(req.params.id);
    if(!contact)
    {
        res.status(404);
        throw new error("No contact found!");
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("Cannot change other user contacts");
    }
    const updated = await Contacts.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new : true}
    );
    res.status(200).json(updated);
});

// @desc Delete a contact
// @route DELETE /api/contacts/:id
// @access private
const deletecontact = asynchandler(async (req, res) => {
   const contact = await Contacts.findByIdAndDelete(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("No contact found!");
    }
    if(contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("Cannot change other user contacts");
    }

    res.status(200).json({ message: "Contact deleted successfully" });
});

module.exports = { getcontacts, createcontact, getcontact, updatecontact, deletecontact };