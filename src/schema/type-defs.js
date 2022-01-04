import { gql } from 'apollo-server-express'


const typeDefs = gql`

type User @exclude {
  id: ID! @id
  firstName: String!
  lastName: String!
  email: String!
  password: String! @private
  memAnchor: ID
  role: String
  comments: [Comment] @relationship(type: "WROTE", direction: OUT)
  createdAt: DateTime @timestamp(operations: [CREATE])
  updatedAt: DateTime @timestamp(operations: [UPDATE])
}


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

type Member @auth (rules: [{ roles: ["zadmin", "admin"] }]) {
  id: ID! @id
  firstName: String!
  lastName: String!
  gender: String!
  dob: Date
  dod: Date
  description: String
  father: Member @relationship( type: "FATHER", direction: IN)
  mother: Member @relationship( type: "MOTHER", direction: IN)
  clan: Clan @relationship(type: "BELONGS", direction: OUT)
  comments: [Comment] @relationship(type: "COMMENTED", direction: IN)
}

type Comment {
  id: ID! @id
  content: String!
  member: Member @relationship(type: "COMMENTED", direction: OUT)
  user: User @relationship(type: "WROTE", direction: IN)
  updated: DateTime! @timestamp
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
