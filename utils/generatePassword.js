function generatePassword(length = 8) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?'; // optional, if you want special chars

  const allChars = uppercase + lowercase + numbers;

  let password = '';
  
  // Ensure password has at least one uppercase, one lowercase, one number
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];

  // Fill the rest randomly
  for(let i = 3; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password so the first 3 chars aren’t always uppercase, lowercase, number
  password = password.split('').sort(() => 0.5 - Math.random()).join('');

  return password;
};

module.exports = generatePassword;