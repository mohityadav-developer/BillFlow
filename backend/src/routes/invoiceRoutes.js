const router = require("express").Router();
const auth = require("../middleware/auth");
const c = require("../controllers/invoiceController");
router.use(auth);
router.get("/", c.list);
router.post("/", c.create);
router.get("/:id", c.getOne);
router.patch("/:id/status", c.updateStatus);
module.exports = router;
