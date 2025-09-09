import bcrypt from 'bcrypt';
const hash = await bcrypt.hash('1234567890', 12);
console.log(hash);