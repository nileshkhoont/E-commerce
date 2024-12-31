"use strict";

const express = require("express");
const cors = require('cors');
const http = require("http");
require("dotenv").config(); 
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./helpers/swaggerConnection");
const { dbConnect } = require("./config/dbConnection");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

