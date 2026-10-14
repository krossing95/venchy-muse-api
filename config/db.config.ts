"use server";

import mongoose from "mongoose";

let isConnected = false; // Variable to track the connection status

export const connection = async () => {
  // Set strict query mode for Mongoose to prevent unknown field queries.
  mongoose.set("strictQuery", true);

  // If the connection is already established, return without creating a new connection.
  if (isConnected) return;

  const mongodbUrl = process.env.DB_URL;

  if (!mongodbUrl) return;

  try {
    await mongoose.connect(mongodbUrl, {
      minPoolSize: 10,
      connectTimeoutMS: 20000,
    });
    isConnected = true; // Set the connection status to true
  } catch (error) {
    console.log(error);

    throw new Error("connection failed");
  }
};
