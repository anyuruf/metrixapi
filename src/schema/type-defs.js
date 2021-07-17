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
  role: String!
  comments: [Comment] @relationship(type: "WROTE", direction: OUT)
}

type AuthToken @exclude {
  token: String!
}

type Comment {
  id: ID! @id
  content: String!
  created: DateTime @timestamp
  updated: DateTime @timestamp
  member: Member @relationship(type: "COMMENTED", direction: OUT)
  user: User @relationship(type: "WROTE", direction: IN)
}

type Clan {
 id: ID! @id
 cname: String
 tribe: String
 members: [Member] @relationship(type: "BELONGS", direction: IN)
}


type Member {
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
    dadAnchor: ID
  ): AuthToken

  login(email: String!, password: String!): AuthToken

}
`;
module.exports = typeDefs;
