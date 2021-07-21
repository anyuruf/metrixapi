import { gql } from 'apollo-server-express'


const typeDefs = gql`

scalar DateTime
scalar Date

type User @exclude {
  id: ID! @id
  firstName: String!
  lastName: String!
  email: String!
  password: String! @private
  memAnchor: ID
  role: String @auth(rules: [{roles: ["zadmin"]}])
  comments: [Comment] @relationship(type: "WROTE", direction: OUT)
  created: DateTime @timestamp(operations: [CREATE])
  updated: DateTime @timestamp(operations: [UPDATE])
}

type AuthToken @exclude {
  token: String!
}

type Clan @auth(rules: [{roles: ["zadmin", "admin"]}]) {
 id: ID! @id
 cname: String
 tribe: String
 nation:String
 members: [Member] @relationship(type: "BELONGS", direction: IN)
}

type Member @auth(rules: [{roles: ["zadmin", "admin"]}]) {
  id: ID! @id
  firstName: String!
  lastName: String!
  gender: String!
  dob: Date
  dod: Date
  Description: String
  clan: Clan @relationship(type: "BELONGS", direction: OUT)
  comments: [Comment] @relationship(type: "COMMENTED", direction: IN)
}

type Comment {
  id: ID! @id
  content: String!
  member: Member @relationship(type: "COMMENTED", direction: OUT)
  user: User @relationship(type: "WROTE", direction: IN)
  updated: DateTime @timestamp
}

type Query {
  currentUser: User
      @cypher(
        statement: """
        MATCH (u:User {id: $auth.jwt.id})
        RETURN u
        """
      )
}

type Mutation {
  signUp(
    firstName: String!,
    lastName: String!,
    email: String!,
    role: String,
    password: String!,
    memAnchor: ID
  ): AuthToken

  SignIn(email: String!, password: String!): AuthToken

}
`;
module.exports = typeDefs;
