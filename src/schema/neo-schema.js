import { Neo4jGraphQL } from '@neo4j/graphql'
import dotenv from 'dotenv'
import typeDefs  from './type-defs'
import resolvers from './resolvers'
import driver from '../utils/driver'

dotenv.config()

// Schema instance to be injected into the Apollo Server object in the entry file
// root index.js


const neoSchema = new Neo4jGraphQL({
  typeDefs,
  resolvers,
  driver,
  config: {
    jwt: {
      secret: process.env.JWT_SECRET
    }
  }
 })

  module.exports = neoSchema;
