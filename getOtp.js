const crypto = require('crypto');
function generateOTP() {
    const otp = crypto.randomInt(1111, 9999);
    return otp.toString();
}
// console.log(generateOTP(4));
const otp = generateOTP();
module.exports = otp;