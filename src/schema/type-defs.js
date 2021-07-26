import { gql } from 'apollo-server-express'


const typeDefs = gql`

scalar DateTime
scalar Date

type User {
  id: ID! @id
  firstName: String!
  lastName: String!
  email: String!
  password: String! @private
  memAnchor: ID
  role: String
  comments: [Comment] @relationship(type: "WROTE", direction: OUT)
  created: DateTime @timestamp(operations: [CREATE])
  updated: DateTime @timestamp(operations: [UPDATE])
}

extend type User @exclude @auth (rules: [
       {operations: [CREATE,CONNECT, DISCONNECT], roles: ["zadmin", "admin"]},
       {operations: [UPDATE, READ, DELETE],
          OR: [{ roles: ["zadmin", "admin"] }, { allow: { id: "$jwt.sub" } }]}
    ])

type AuthToken @exclude {
  token: String!
}

type Clan  {
 id: ID! @id
 cname: String
 tribe: String
 nation:String
 members: [Member] @relationship(type: "BELONGS", direction: IN)
}

type Member  {
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

  changePassword(
    email: String!,
    password: String!
  ): AuthToken

  signIn(email: String!, password: String!): AuthToken

}
`;
module.exports = typeDefs;
