const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
     try {
        const email = req.body['email']
        const name = req.body['name']
        const password = req.body['password']

        const checkUser = await prisma.user.findMany({
            where:{
                email: email        
            }
        })
        if(checkUser.length > 0) throw new Error(`User with email ${email} already exists!`)

        const hashPassword = await bcrypt.hash(password, 10)
        const createAccount = await prisma.user.create({
            data:{
                email: email,
                name: name,
                password: hashPassword
            }
        })
        res.status(201).json({
            message: 'Successfully',
            data: createAccount.email
        })

    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
  
      if (!user) {
        return res.status(400).json("Invalid credentials");
      }
  
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(400).json("Invalid credentials");
      } else {
        const expiresIn = 2 * 24 * 3600;
  
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.TOKEN_SECRET,
          { expiresIn }
        );
        const { id, email, name } = user;
        console.log(user)
        return res.status(200).json({ user: { id, email, name }, token });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

const jwtAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send({message: "User not logged in"})

     jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log(err)
            return res.sendStatus(403)
        }
        req.user = user
        
        next()
    })
};

module.exports = {
    register,
    login,
    jwtAuth
}