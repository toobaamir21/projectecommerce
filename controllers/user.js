const prisma = require("../script");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserRegisterDTO, UserLoginDTO } = require("../dtos/user.dto");

const { v4: uuidv4 } = require("uuid");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // const matchedUser = await prisma.user.findFirst({
    //   where: { email },
    // });
    const matchedUser =
      await prisma.$queryRaw`SELECT * FROM User WHERE email=${email}`;

    if (matchedUser.length != 0) {
      return res.status(400).json({ error: "User already exist" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    // const user = await prisma.user.create({
    //   data: {
    //     name,
    //     email,
    //     secret: {
    //       create: { password: hashedPass },
    //     },
    //   },
    //   include: {
    //     secret: true,
    //   },
    // });
    const userId = uuidv4();
    await prisma.$transaction([
      prisma.$queryRaw`
        INSERT INTO USER (id, name, email) VALUES (${userId}, ${name}, ${email})
      `,
      prisma.$queryRaw`
        INSERT INTO UserSecret (id, userId, password) VALUES (${uuidv4()}, ${userId}, ${hashedPass})
      `,
    ]);

    const combinedUserInfo = await prisma.$queryRaw`
  SELECT 
    u.id, 
    u.name, 
    u.email,
    us.password, 
    us.userId
  FROM 
    User u 
  INNER JOIN 
    UserSecret us 
  ON 
    u.id = us.userId
  WHERE 
    u.id = ${userId};
`;
    if (combinedUserInfo.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userDTO = UserRegisterDTO(combinedUserInfo[0]);
    res.json({ user: userDTO });
  } catch (error) {
    res.send(error);
  }
};

//...................................LOGIN.............................////
const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    // const matchedUser = await prisma.user.findFirst({
    //   where: { email },
    //   include: { secret: true },
    // });
    const matchedUser = await prisma.$queryRaw`
    SELECT * FROM USER WHERE email = ${email};
  `;

    if (matchedUser.length == 0) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    const wholeUserInfo = await prisma.$queryRaw`
   SELECT
   u.id,
   u.email,
   us.password
   FROM
   USER u
   INNER JOIN 
   UserSecret us
   ON
   u.id=us.userId
   where 
   u.id = ${matchedUser[0].id}
   `;
    // const hashedPass = bcrypt.compare(password, matchedUser.secret?.password)

    const hashedPass = await bcrypt.compare(
      password,
      wholeUserInfo[0].password
    );
    if (!hashedPass) {
      return res.sendStatus(401);
    }

    const accessToken = jwt.sign(
      { user: wholeUserInfo[0].id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { user: wholeUserInfo[0].id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // const userSession = await prisma.session.create({
    //   data: {
    //     refreshToken,
    //     userId: matchedUser.id,
    //   },
    // });
    // const user = {
    //   matchedUser,
    //   accessToken,
    // };
    const sessionId = uuidv4();
    await prisma.$queryRaw`INSERT INTO SESSION(id,refreshToken,userId) VALUES(${sessionId},${refreshToken},${wholeUserInfo[0].id})`;

    const showSession = await prisma.$queryRaw`
    SELECT * FROM SESSION WHERE userId = ${wholeUserInfo[0].id}
    `;

    const updatedUserInfo = wholeUserInfo.map((user) => {
      return {
        ...user,
        accessToken,
      };
    });

    const userDTO = UserLoginDTO(updatedUserInfo[0]);
    res.json({ user: userDTO });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser, login };
