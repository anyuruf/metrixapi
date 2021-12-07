import neoSchema from './schema/neo-schema';

const { ApolloServer } = require('apollo-server')
const { cors } = require('cors')
/*
 * Create a new Apollo Server instance, serving the GraphQL schema
 * created using Neo4jGraphQL from schema folder
 */
const server = new ApolloServer({
  cors:{ 
	origin: 'http://localhost:4200',
	credentials: true},
  context: ({ req }) => ({ req }),
  schema: neoSchema.schema,
  introspection: true,
  playground: true
})

// Start the Server
server.listen().then(({ url }) => {
    console.log(` Server ready at ${url}`);
});
