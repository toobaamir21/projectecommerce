require("dotenv").config();
const jwt = require("jsonwebtoken");
const prisma = require("../script");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.log("this is err", err);
      return res.sendStatus(403);
    }
    const found = await prisma.user.findFirst({
      where: {
        id: decoded.user,
      },
    });
    if (found) {
      req.userId = decoded.user;
      next();
    } else {
      return res.sendStatus(404);
    }
  });
};
module.exports = verifyJWT;
