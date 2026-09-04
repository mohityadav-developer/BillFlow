require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");
const Client = require("./models/Client");
const Invoice = require("./models/Invoice");

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const password = await bcrypt.hash("password", 10);
  const user = await User.findOneAndUpdate(
    { email: "premium@billflow.app" },
    {
      name: "Demo Premium",
      email: "premium@billflow.app",
      password,
      role: "premium",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  let client = await Client.findOne({ user: user._id });
  if (!client)
    client = await Client.create({
      user: user._id,
      name: "Northstar Studio",
      email: "billing@northstar.example",
      phone: "+91 98765 43210",
      billingAddress: "14 Residency Road, Bengaluru 560025",
    });
  const existing = await Invoice.findOne({
    user: user._id,
    invoiceNumber: "INV-2026-001",
  });
  if (!existing)
    await Invoice.create({
      user: user._id,
      client: client._id,
      invoiceNumber: "INV-2026-001",
      items: [
        {
          description: "Product design retainer",
          quantity: 1,
          unitPrice: 2400,
        },
        { description: "Frontend implementation", quantity: 12, unitPrice: 95 },
      ],
      taxPercent: 18,
      subtotal: 3540,
      taxAmount: 637.2,
      total: 4177.2,
      dueDate: new Date(Date.now() + 14 * 86400000),
      status: "sent",
    });
  console.log("Demo premium account ready: premium@ledgerly.app / password");
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
