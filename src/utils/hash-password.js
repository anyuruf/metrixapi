import { hashSync } from 'bcrypt'

const saltRounds = 11

function hashPassword(plainText) {
    return new Promise((resolve, reject) => {
        hashSync(plainText, saltRounds, (err, hash) => {
            if (err) {
                reject(err);
            }

            resolve(hash);
        });
    });
}

// exported to ./hash-crypt.js
export default hashPassword;
