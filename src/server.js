"use strict";

const express = require("express");
const cors = require('cors');
const http = require("http");
require("dotenv").config(); 
const { dbConnect } = require("./config/dbConnection");
const fileUpload = require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./helpers/swaggerConnection");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Swagger documentation setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Authentication API Routes
app.use("/api/v1/auth", require("./routes/auth/authRoute"));

// Admin API Routes
app.use("/api/admin", require("./routes/admin/adminRoutes"));

// Seller API Routes
app.use("/api/seller", require("./routes/seller/sellerRoutes"));

// User API Routes
app.use("/api/v1/user", require("./routes/user/userRoutes"));

// Connect to the database
dbConnect();

// Create an HTTP server using the express app
const server = http.createServer(app);

// Start the server and listen on the provided PORT
server.listen(process.env.PORT, () => {
    console.log(`-----------------------------------------------`);
    console.log(`Listening on ${process.env.BASE_URL}`);
    console.log(`Swagger URL :- ${process.env.BASE_URL}/api-docs`);
    console.log(`-----------------------------------------------`);
});

module.exports = app;

// admin - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzUyZjE3NjUwODY0MDBhZGQ5NmEzYyIsImlhdCI6MTczNTczMzAyMCwiZXhwIjoxNzQwOTE3MDIwfQ.EF9pxrHF6MkiYkpv2HfnkD0pzOXhPJtKgpEZPFv7wrQ

// seller - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzUyZjQ4MzFhMmFiYjhiNWFjODU4NCIsImlhdCI6MTczNTczMzA4MSwiZXhwIjoxNzQwOTE3MDgxfQ.s-DeXehkFyuWPQKKsXWm2ye4gS01GLO0z-qhG04-JeU

// user - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzUyZmU2YWVlOGYyNjIxM2U2ZGQzYSIsImlhdCI6MTczNTczMzIzMSwiZXhwIjoxNzQwOTE3MjMxfQ.Z-xGO_v_m9KkFlYqtnpfrUZuu3H1TnwgSw6vTc3bkqU