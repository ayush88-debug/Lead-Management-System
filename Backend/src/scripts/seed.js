import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import Lead from "../models/lead.model.js";
import connectDB from "../config/connectDB.js";

dotenv.config({
  path: "./.env",
});

const seedLeads = async (count = 120) => {
  try {
    await connectDB();
    console.log("Database connected for seeding.");

    await Lead.deleteMany({});
    console.log("Cleared existing leads.");

    const leads = [];
    const sources = ["website", "facebook_ads", "google_ads", "referral", "events", "other"];
    const statuses = ["new", "contacted", "qualified", "lost", "won"];

    for (let i = 0; i < count; i++) {
      leads.push({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number(),
        company: faker.company.name(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        source: faker.helpers.arrayElement(sources),
        status: faker.helpers.arrayElement(statuses),
        score: faker.number.int({ min: 0, max: 100 }),
        lead_value: faker.number.int({ min: 100, max: 5000 }),
        is_qualified: faker.datatype.boolean(),
        last_activity_at: faker.date.recent({ days: 30 }),
      });
    }

    await Lead.insertMany(leads);
    console.log(`${count} leads have been successfully seeded!`);
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedLeads();