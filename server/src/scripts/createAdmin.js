import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const [name, email, password] = process.argv.slice(2);

if (!name || !email || !password) {
  console.error('Usage: npm run create-admin -- "Name" email@example.com password');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const existing = await User.findOne({ email: email.toLowerCase() });

if (existing) {
  await User.updateOne({ _id: existing._id }, { role: "admin" });
  console.log(`Promoted ${email} to admin`);
} else {
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed, role: "admin" });
  console.log(`Created admin ${email}`);
}

await mongoose.disconnect();
