"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _find = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/find"));

var _driver = require("../driver");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

const resolvers = {
  signUp: (obj, args, context, info) => {
    args.password = hashSync(args.password, 11);
    const session = context.driver.session();
    return session.run(`
        CREATE (u:User) SET u += $args, u.id = randomUUID()
        RETURN u`, {
      args
    }).then(res => {
      session.close();
      const {
        id,
        firstName
      } = res.records[0].get('u').properties;
      return {
        token: _jsonwebtoken.default.sign({
          id,
          firstName
        }, process.env.JWT_SECRET, {
          expiresIn: '14d'
        })
      };
    });
  },
  login: async (obj, args, context, info) => {
    const [user] = await (0, _find.default)(User).call(User, {
      where: {
        email: args.email
      }
    });
    const {
      id,
      firstName,
      password
    } = user;

    if (!compareSync(args.password, password)) {
      throw new Error('Authorization Error');
    }

    return {
      token: _jsonwebtoken.default.sign({
        id,
        firstName
      }, process.env.JWT_SECRET, {
        expiresIn: '14d'
      })
    };
  }
};
module.exports = resolvers;