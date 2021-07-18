import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

function decodeJWT(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.NEO4J_GRAPHQL_JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(err)
            }

            resolve(decoded)
        });
    });
}

// exported to ./hash-crypt.js
export default decodeJWT;
