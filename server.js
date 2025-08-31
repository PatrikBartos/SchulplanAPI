import app from './app.js';
import express from 'express';
import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config();

const port = process.env.PORT;

connectDB();

const sslOptions = {
  key: fs.readFileSync('./keys/key.pem'),
  cert: fs.readFileSync('./keys/cert.pem'),
};

// app.listen... lauft nur HTTP und https.createServer(...) -> Server lauft auf https = Verschluesselt
const server = https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Server is running on port https://localhost:${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
