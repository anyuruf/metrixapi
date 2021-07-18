import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

function createJWT(payLoad) {
    return new Promise((resolve, reject) => {
        jwt.sign(
          { ...payLoad },
          process.env.JWT_SECRET,
          {expiresIn: '14d' },
          (err, token) => {
            if (err) {
                return reject(err)
            }

            return resolve(token)
        })
    })
}

// exported to ./hash-crypt.js
export default createJWT;
