import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./models/user.model";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const email = "admin";
    const password = "admin";
    const existing = await User.findOne({ email });
    if (existing) {
      existing.password = await bcrypt.hash(password, 12);
      existing.role = "admin";
      existing.name = existing.name || "Admin";
      existing.acceptedTerms = true;
      await existing.save();
      console.log("Admin updated");
    } else {
      await User.create({
        name: "Admin",
        email,
        password: await bcrypt.hash(password, 12),
        acceptedTerms: true,
        role: "admin",
      });
      console.log("Admin created");
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

seedAdmin();
