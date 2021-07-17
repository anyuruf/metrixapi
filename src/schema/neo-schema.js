import { Neo4jGraphQL } from '@neo4j/graphql'
import dotenv from 'dotenv'
import typeDefs  from './type-defs'
import resolvers from './resolvers'
import driver from '../driver'

dotenv.config()

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
