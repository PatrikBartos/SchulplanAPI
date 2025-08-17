import app from './app.js';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config();

const port = process.env.PORT;

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
