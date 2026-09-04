const User = require("../models/User");
async function uploadLogo(req, res) {
  if (req.user.role !== "premium")
    return res
      .status(403)
      .json({ message: "Custom branding is available to premium users only" });
  if (!req.file)
    return res.status(400).json({ message: "Please select an image" });
  const logoUrl = `/uploads/${req.file.filename}`;
  await User.findByIdAndUpdate(req.user._id, { logoUrl });
  res.json({ logoUrl });
}
module.exports = { uploadLogo };
