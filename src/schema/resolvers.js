import { OGM } from '@neo4j/graphql-ogm'
import jwt from 'jsonwebtoken'
import typeDefs  from './type-defs'
import driver from '../utils/driver'
import { hashPassword, comparePassword, createJWT } from '../utils/hash-crypt'

// OGM used on the login and SignUp mutations.


const ogm = new OGM({
  typeDefs,
  driver,
})

const User = ogm.model("User")

const resolvers = {
  Mutation: {
    signUp: async (obj, args, context, info) => {

    const [existing] = await User.find({
        where: { email: args.email }
    });
    if (existing) {
        throw new Error("user with that email already exists");
    }

     const hash = await hashPassword(args.password)


    const user = (
        await User.create({
            input: [
                {
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email,
                    role: args.role,
                    password: hash,
                }
            ]
        })
    )

    const { id, firstName }  = user
    const payLoad = { id, firstName }

    return {
            token: createJWT(payLoad)
        }
  },

    signIn: async (obj, args, context, info) => {

      const [user] = await User.find({ where: { email: args.email } })

      const { id, firstName, password } = user
      const payLoad = { id, firstName }

      const equal = await comparePassword(args.password, password)

      if (!equal) {
          throw new Error("wrong password")
      }


      return {
        token: createJWT(payLoad)
        }
      }
    }
}

module.exports = resolvers;
