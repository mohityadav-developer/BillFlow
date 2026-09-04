const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { isEmail, requireFields } = require("../utils/validation");

function tokenFor(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}
function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    logoUrl: user.logoUrl,
  };
}

async function register(req, res) {
  const missing = requireFields(req.body, ["name", "email", "password"]);
  if (missing.length)
    return res.status(400).json({ message: `Missing: ${missing.join(", ")}` });
  if (!isEmail(req.body.email))
    return res.status(400).json({ message: "Enter a valid email address" });
  if (req.body.password.length < 6)
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  const exists = await User.findOne({ email: req.body.email.toLowerCase() });
  if (exists)
    return res.status(409).json({ message: "Email is already registered" });
  const password = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password,
    role: "free",
  });
  res.status(201).json({ token: tokenFor(user), user: publicUser(user) });
}

async function login(req, res) {
  const user = await User.findOne({
    email: String(req.body.email || "").toLowerCase(),
  });
  if (!user || !(await bcrypt.compare(req.body.password || "", user.password)))
    return res.status(401).json({ message: "Invalid email or password" });
  res.json({ token: tokenFor(user), user: publicUser(user) });
}

async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}
module.exports = { register, login, me };
