"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _neo4jDriver = _interopRequireDefault(require("neo4j-driver"));

var _dotenv = _interopRequireDefault(require("dotenv"));

// set environment variables from .env
_dotenv.default.config();

const driver = _neo4jDriver.default.driver(process.env.NEO4J_URI, _neo4jDriver.default.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD));

module.exports = driver;