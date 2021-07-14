"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _graphql = require("@neo4j/graphql");

var _graphqlOgm = require("@neo4j/graphql-ogm");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _driver = require("./driver");

var _typeDefs = require("./schema/type-defs");

var _resolvers = require("./schema/resolvers");

//Local Imports
const ogm = new _graphqlOgm.OGM({
  typeDefs: _typeDefs.typeDefs,
  driver: _driver.driver
});
const User = ogm.model('User');
const neoSchema = new _graphql.Neo4jGraphQL({
  typeDefs: _typeDefs.typeDefs,
  resolvers: _resolvers.resolvers,
  driver: _driver.driver,
  config: {
    jwt: {
      secret: process.env.JWT_SECRET
    }
  }
});
module.exports = neoSchema;