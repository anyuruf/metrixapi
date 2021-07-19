"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _graphql = require("@neo4j/graphql");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _typeDefs = _interopRequireDefault(require("./type-defs"));

var _resolvers = _interopRequireDefault(require("./resolvers"));

var _driver = _interopRequireDefault(require("../utils/driver"));

_dotenv.default.config(); // Schema instance to be injected into the Apollo Server object in the entry file
// root index.js


const neoSchema = new _graphql.Neo4jGraphQL({
  typeDefs: _typeDefs.default,
  resolvers: _resolvers.default,
  driver: _driver.default,
  config: {
    jwt: {
      secret: process.env.JWT_SECRET
    }
  }
});
module.exports = neoSchema;