import neo4j from 'neo4j-driver'
import dotenv from 'dotenv'

dotenv.config()

// the Neo4j driver injected into neo-schema
// instance into the context object so it is available in the
// generated resolvers to connect to the database and OGM in the resolvers file

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USER,
    process.env.NEO4J_PASSWORD
  )
);

module.exports = driver;
