const { PrismaClient } = require('@prisma/client');
const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors');

const prisma = new PrismaClient();
const app = new express();

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
  },
  apis: ["./api-docs.yaml"],
  license: {
    url: "http://localhost:3000",
  }
};

const specs = swaggerJsdoc(options);

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403)

    req.user = user;
    next();
  })
}

app.get('/home', (req, res) => {
  res.send('Welcome To Home Page');
});

app.post('/Account/createNewAccount', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await prisma.User.create({
    data: {
      email: email,
      password: password,
    },
  })
  res.json({ user })
})

app.get('/Account/login', authenticateToken, async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const post = await prisma.User.find({
    where: { email: email, password: password },
  })
  res.send(post.filter(post => post.User.email === req.params.email))
})

app.delete('/Account/delete/:id', async (req, res) => {
  const id = req.params.id;
  const post = await prisma.User.delete({
    where: { id: Number(id) },
  })
  res.json(post);
})

app.post('/user/Record/newRecord', async (req, res) => {
  const name = req.body.name;
  const userID = req.body.userID;
  const stay = req.body.stay;
  const bill = req.body.bill;
  const room = req.body.room;
  const date = req.body.date;
  const published = req.body.published;
  const result = await prisma.Record.create({
    data: {
      name: name,
      userID: userID,
      stay: stay,
      bill: bill,
      room: room,
      date: date,
      published: published
    },
  })
  res.json({ result });
})

app.put('/user/Record/publish/:id', async (req, res) => {
  const id = req.params.id;
  const post = await prisma.Record.update({
    where: { id: id },
    data: { published: true },
  })
  res.json(post.filter(post => post.Record.id === req.params))
})

app.get('/user/Record/id', authenticateToken, async (req, res) => {
  const id = req.params.id;
  const post = await prisma.Record.findMany({
    where: { id: id }
  })
  res.json(post.filter(post => post.Record.id === req.params));
})

app.delete('/user/Record/delete/:id', async (req, res) => {
  const id = req.params.id;
  const post = await prisma.Record.delete({
    where: { id: Number(id) }
  })
  res.json({ post });
})

app.listen(3000, () => {
  console.log("server is listening on 3000")
})