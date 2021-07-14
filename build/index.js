"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _apolloServerExpress = require("apollo-server-express");

var _express = _interopRequireDefault(require("express"));

var _neoSchema = _interopRequireDefault(require("./schema/neo-schema"));

var _bcrypt = require("bcrypt");

var _driver = require("./driver");

//Local Imports
const app = (0, _express.default)();
/*
 * Create a new ApolloServer instance, serving the GraphQL schema
 * created using Neo4jGraphQL above and injecting the Neo4j driver
 * instance into the context object so it is available in the
 * generated resolvers to connect to the database.
 */

const server = new _apolloServerExpress.ApolloServer({
  context: ({
    req
  }) => {
    return {
      req
    };
  },
  schema: _neoSchema.default.schema,
  introspection: true,
  playground: true
}); // Specify host, port and path for GraphQL endpoint

const port = process.env.GRAPHQL_SERVER_PORT || 4001;
const path = process.env.GRAPHQL_SERVER_PATH || '/graphql';
const host = process.env.GRAPHQL_SERVER_HOST || '0.0.0.0';
/*
 * Optionally, apply Express middleware for authentication, etc
 * This also also allows us to specify a path for the GraphQL endpoint
 */

server.applyMiddleware({
  app,
  path
});
app.listen({
  host,
  port,
  path
}, () => {
  console.log(`GraphQL server ready at http://${host}:${port}${path}`);
});