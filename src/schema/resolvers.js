import dotenv from 'dotenv'
import typeDefs  from './type-defs'
import driver from '../utils/driver'
import { hashPassword, comparePassword, createJWT } from '../utils/hash-crypt'

// OGM used on the login and SignUp mutations.
dotenv.config()

const { OGM } = require("@neo4j/graphql-ogm");

const ogm = new OGM({
  typeDefs,
  driver
})

const User = ogm.model("User")

const resolvers = {

  Mutation: {
    signUp: async (obj, args, context, info) => {

    const { roles } = context.auth.jwt.roles;
    if(!(roles === "zadmin" || "admin")) {
      throw new Error("Must be admin to create users!!!");
    }

    const [existing] = await User.find({
        where: { email: args.email }
    });
    if (existing) {
        throw new Error("user with that email already exists");
    }

     const hash = await hashPassword(args.password)

     const [user] = (
        await User.create({
            input: [
                {
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email,
                    role: args.role,
                    password: hash
                }
            ]
        })
    ).users

    const { id, firstName, role }  = user
    const payLoad = { id, firstName, roles:role }

    const token = await createJWT(payLoad)

    return { token }

  },

  changePassword: async (obj, args, context, info) => {

    const [user] = await User.find({ where: { email: args.email } })
    const hash = await hashPassword(args.password)

    const { users } = await User.update({
    where: { email: args.email },
    update: { password: hash },
    });

      const { id, firstName, role }  = user
      const payLoad = { id, firstName, roles:role }

      const token = await createJWT(payLoad)

      return { token }

  },

    signIn: async (obj, args, context, info) => {

      const [user] = await User.find({ where: { email: args.email } })

      const { id, firstName, role, password } = user

      const equal = await comparePassword(args.password, password)

      if (!equal) {
          throw new Error("wrong password")
      }

      const payLoad = { id, firstName, roles:role }

      const token = await createJWT(payLoad)

      return { token }

      }
    }
}

module.exports = resolvers;
