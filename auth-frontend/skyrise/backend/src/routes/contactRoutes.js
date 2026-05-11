const express = require("express");
const router = express.Router();
const { submitContact, getContacts, updateContactStatus, deleteContact } = require("../controllers/contactController");
const { protect } = require("../middleware/auth");

router.post("/", submitContact);
router.get("/", protect, getContacts);
router.put("/:id", protect, updateContactStatus);
router.delete("/:id", protect, deleteContact);

module.exports = router;
