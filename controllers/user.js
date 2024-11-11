const prisma = require("../script");
require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const matchedUser = await prisma.user.findFirst({
      where: { email },
    });

    if (matchedUser) {
      return res.status(400).json({ error: "User already exist" });
    } 

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        secret: {
          create: { password: hashedPass },
        },
      },
      include: {
        secret: true,
      },
    });
    res.json({ user });
  } catch (error) {
    res.send(error);
  }
};



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const matchedUser = await prisma.user.findFirst({
      where: { email },
      include: { secret: true }
    });

   
    if (!matchedUser) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

   
    const hashedPass =  bcrypt.compare(password, matchedUser.secret?.password);
    if (!hashedPass) {
      return res.sendStatus(401);
    }

 
    const accessToken = jwt.sign(
      { user: matchedUser.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { user: matchedUser.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const userSession = await prisma.session.create({
      data: {
        refreshToken,
        userId: matchedUser.id
      }
    });

    console.log(userSession);
    res.json({ user: matchedUser, accessToken, refreshToken });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {createUser, login};
