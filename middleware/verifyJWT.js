require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  console.log(authHeader);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("this is err",err);
      
      return res.sendStatus(403)};
    req.userId =decoded.user;
    console.log(req.userId)
    next();
  });
};
module.exports = verifyJWT