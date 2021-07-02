import { typeDefs } from './graphql-schema'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import neo4j from 'neo4j-driver'
import { OGM } from '@neo4j/graphql-ogm'
import { Neo4jGraphQL } from '@neo4j/graphql'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { compareSync, hashSync } from 'bcrypt'
import { v4 as randomUUID } from 'uuid'

// set environment variables from .env
dotenv.config()

const app = express()
/*
 * Create a Neo4j driver instance to connect to the database
 * using credentials specified as environment variables
 * with fallback to defaults
 */
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USER,
    process.env.NEO4J_PASSWORD
  )
)

const ogm = new OGM({
  typeDefs,
  driver,
})

const User = ogm.model('User')

/*
 * Create an executable GraphQL schema object from GraphQL type definitions
 * including autogenerated queries and mutations.
 * Optionally a config object can be included to specify which types to include
 * in generated queries and/or mutations. Read more in the docs:
 * https://grandstack.io/docs/neo4j-graphql-js-api.html#makeaugmentedschemaoptions-graphqlschema
 */

const resolvers = {
  Mutation: {
    signUp: (obj, args, context, info) => {
      args.password = hashSync(args.password, 11)

      const session = context.driver.session()

      return session
        .run(
          `
        CREATE (u:User) SET u += $args, u.id = randomUUID()
        RETURN u`,
          { args }
        )
        .then((res) => {
          session.close()
          const { id, firstName } = res.records[0].get('u').properties

          return {
            token: jwt.sign({ id, firstName }, process.env.JWT_SECRET, {
              expiresIn: '14d',
            }),
          }
        })
    },

    login: async (obj, args, context, info) => {
      const [user] = await User.find({ where: { email: args.email } })

      const { id, firstName, password } = user
      if (!compareSync(args.password, password)) {
        throw new Error('Authorization Error')
      }

      return {
        token: jwt.sign({ id, firstName }, process.env.JWT_SECRET, {
          expiresIn: '14d',
        }),
      }
    },
  },
}
/*
 * Create an executable GraphQL schema object from GraphQL type definitions
 * including autogenerated queries and mutations.
 * Read more in the docs:
 * https://neo4j.com/docs/graphql-manual/current/
 */

const neoSchema = new Neo4jGraphQL({
  typeDefs,
  resolvers,
  driver,
  config: {
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  }, })

/*
 * Create a new ApolloServer instance, serving the GraphQL schema
 * created using makeAugmentedSchema above and injecting the Neo4j driver
 * instance into the context object so it is available in the
 * generated resolvers to connect to the database.
 */
const server = new ApolloServer({
  context: ({ req }) => {
   return {
     req,
   }
 },
  schema: neoSchema.schema,
  introspection: true,
  playground: true,
})

// Specify host, port and path for GraphQL endpoint
const port = process.env.GRAPHQL_SERVER_PORT || 4001
const path = process.env.GRAPHQL_SERVER_PATH || '/graphql'
const host = process.env.GRAPHQL_SERVER_HOST || '0.0.0.0'

/*
 * Optionally, apply Express middleware for authentication, etc
 * This also also allows us to specify a path for the GraphQL endpoint
 */
server.applyMiddleware({ app, path })

app.listen({ host, port, path }, () => {
  console.log(`GraphQL server ready at http://${host}:${port}${path}`)
})
