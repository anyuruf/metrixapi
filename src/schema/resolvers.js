import { compareSync, hashSync } from 'bcrypt'
import { OGM } from '@neo4j/graphql-ogm'
import jwt from 'jsonwebtoken'
import typeDefs  from './type-defs'
import driver from '../driver'

// OGM used on the login resolver.
const ogm = new OGM({
  typeDefs,
  driver,
})

const User = ogm.model('User')

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
      }
    }
}

module.exports = resolvers;
