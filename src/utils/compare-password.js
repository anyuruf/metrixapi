import { compare } from "bcrypt";

function comparePassword(plainText, hash) {
    return new Promise((resolve, reject) => {
        compare(plainText, hash, (err, result) => {
            if (err) {
                return reject(err);
            }

            return resolve(result);
        });
    });
}

// exported to ./hash-crypt.js
export default comparePassword;
