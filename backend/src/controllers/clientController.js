const Client = require("../models/Client");
const Invoice = require("../models/Invoice");
const { isEmail, requireFields } = require("../utils/validation");

async function list(req, res) {
  res.json(await Client.find({ user: req.user._id }).sort({ createdAt: -1 }));
}
async function create(req, res) {
  const missing = requireFields(req.body, [
    "name",
    "email",
    "phone",
    "billingAddress",
  ]);
  if (missing.length)
    return res.status(400).json({ message: `Missing: ${missing.join(", ")}` });
  if (!isEmail(req.body.email))
    return res.status(400).json({ message: "Enter a valid email address" });
  res
    .status(201)
    .json(await Client.create({ ...req.body, user: req.user._id }));
}
async function update(req, res) {
  const client = await Client.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true },
  );
  if (!client) return res.status(404).json({ message: "Client not found" });
  res.json(client);
}
async function remove(req, res) {
  const client = await Client.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!client) return res.status(404).json({ message: "Client not found" });
  await Invoice.deleteMany({ client: client._id, user: req.user._id });
  res.status(204).send();
}
module.exports = { list, create, update, remove };
