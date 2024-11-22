const express = require("express");
require("dotenv").config();
const mime = require('mime-types');
const cors = require('cors');


const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors({origin: "*"}));

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const isBase64 = (str) => {
    try {
        return Buffer.from(str, 'base64').toString('base64') === str;
    } catch (err) {
        return false;
    }
};

app.get("/bfhl", (req, res) => {
  try {
    return res.status(200).json({
      operation_code: 1,
    });
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

app.post("/bfhl", (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    if(!data || !file_b64){
        return res.status(400).json({message: "MISSING REQUIRED DATA"});
    }

    const numbers = [];
    const alphabets = [];
    let highestLowercase = '';
    let isPrimeFound = false;

    // Separate numbers and alphabets
    data.forEach((item) => {
        if (!isNaN(item)) {
            numbers.push(item);
            if (isPrime(parseInt(item))) isPrimeFound = true;
        } else {
            alphabets.push(item);
            if (item >= 'a' && item <= 'z' && item > highestLowercase) {
                highestLowercase = item;
            }
        }
    });

    // Handle Base64 file
    let fileValid = false, mimeType = '', fileSizeKb = 0;
    if (file_b64) {
        fileValid = isBase64(file_b64);
        if (fileValid) {
            const buffer = Buffer.from(file_b64, 'base64');
            mimeType = mime.lookup(buffer) || 'unknown';
            fileSizeKb = (buffer.length / 1024).toFixed(2);
        }
    }

    res.status(200).json({
        is_success: true,
        user_id: "mayank_ojha_06012003",
        email: "ojhamayank70@gmail.com",
        roll_number: "0967CS211039",
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
        is_prime_found: isPrimeFound,
        file_valid: fileValid,
        file_mime_type: mimeType,
        file_size_kb: fileSizeKb
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
