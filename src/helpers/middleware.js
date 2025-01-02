"use strict";

const jwt = require("jsonwebtoken");
require("dotenv").config();
const services = require("../helpers/index");
const { HttpStatus } = require("../errors/code");
const Msg = require("../helpers/localization");
const User = require("../models/auth");

/**
 * General function to verify JWT token and authenticate users based on role
 *
 * @param {string} role - The role to authenticate (e.g., "Admin", "Seller", "User")
 */
const authenticateRole = (role) => {
    return async (req, res, next) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        
        if (!token) {
            return res.send(
                services.prepareResponse(
                    HttpStatus.NOT_FOUND, 
                    Msg.TOKEN_REQUIRED
                )
            );
        }
        
        try {
            const decodedToken = jwt.decode(token);
            const currentTimestamp = Date.now() / 1000;
            
            if (currentTimestamp > decodedToken.exp) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.UNAUTHORIZED, 
                        Msg.TOKEN_EXPIRED
                    )
                );
            }
            
            const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: verifiedToken.id });
            
            if (!user) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.NOT_FOUND, 
                        Msg.USER_NOT_EXIST
                    )
                );
            }
            
            if (role && user.type !== role) {
                return res.send(
                    services.prepareResponse(
                        HttpStatus.UNAUTHORIZED, 
                        Msg.UNAUTHORIZED_ACCESS
                    )
                );
            }

            req.authUser = user;
            next();
        
        } catch (error) {
            return res.send(
                services.prepareResponse(
                    HttpStatus.UNAUTHORIZED, 
                    Msg.INVALID_TOKEN
                )
            );
        }
    };
};

module.exports = {
    authenticateAnyUser: authenticateRole(),
    authenticateAdmin: authenticateRole("Admin"),
    authenticateSeller: authenticateRole("Seller"),
    authenticateUser: authenticateRole("User"),
};
