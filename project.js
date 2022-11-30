const { PrismaClient } = require('@prisma/client');
const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
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
};

const specs = swaggerJsdoc(options);


app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/*
@swagger
openapi: 3.0.0
info:
  title: Hotel Management API
  version: 0.1.0
  description: >-
    This is a simple CRUD API application made with Express and documented with
    Swagger
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
          description: the auto generated id of the user
        email:
          type: string
        password:
          type: string
      example:
        id: '1'
        email: example.user@xyz.com
        password: password
    Record:
      type: object
      properties:
        id:
          type: integer
        user:
          type: object
        UserID:
          type: integer
        name:
          type: string
        stay:
          type: integer
        bill:
          type: integer
        room:
          type: string
        published:
          type: boolean
      example:
        id: '1'
        user:
          id: '1'
          email: example.user@xyz.com
          password: password
        userID: '1'
        name: exampleUser
        stay: '2'
        bill: '2000'
        room: 13B
        published: 'true'
paths:
  /user/Record/id:
    get:
      summary: Lists all the Record associated with id
      tags: [Record]
      responses:
        '200':
          description: The list of records.
          content:
            application/json:
              schema:
                $ref: '/home/Garvit/Documents/projectHotelManagement/prisma/schema.prisma'
  /user/Record/newRecord:
    post:
      summary: Creates a new Record
      tags: [Record]
      requestBody:
        required: true
        content:
            application/json:
              schema:
                $ref: '/home/Garvit/Documents/projectHotelManagement/prisma/schema.prisma'
      responses:
        '200':
          description: The created Record.
  /user/Record/publish/{id}:
    put:
      summary: Updates a Record
      tags: [Record]
      parameters:
        - in: path
          name: id
          schema: 
            type: integer
          required: true
          description: The Record id
      requestBody:
        required: true
        content:
            application/json:
              schema:
                $ref: '/home/Garvit/Documents/projectHotelManagement/prisma/schema.prisma'
      responses:
        '204':
          description: Update was successful.
        '404':
          description: Record not found.
  /user/Record/delete/{id}:
    delete:
      summary: Deletes a Record by id
      tags: [Record]
      parameters:
        - in: path
          name: id
          schema:
            type: integer
          required: true
          description: The Record id
      responses:
        '204':
          description: Delete was successful.
        '404':
          description: Record not found.
*/

app.get('/api-docs', (req, res) => {
    res.send(data)
})

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
    const { email, password } = req.params;
    const user = await prisma.User.create({
        data: { ...req.body },
    })
    res.json(user)
})

app.get('/Account/login', authenticateToken, async (req, res, next) => {
    const { email, password } = req.params;
    const post = await prisma.User.findMany({
        where: { email: email, password: password },
    })
    res.send(post.filter(post => post.User.email === req.params.email))
})

app.delete('/Account/delete/:id', async (req, res) => {
    const { id } = req.params;
    const post = await prisma.User.delete({
        where: { id, },
    })
    res.send(post);
})

app.post('/user/Record/newRecord', async (req, res) => {
    const { name, stay, bill, room, date } = req.params;
    const result = await prisma.Record.create({
        data: { ...req.body, published: true },
    })
    res.json(result);
})

app.put('/user/Record/publish/:id', async (req, res) => {
    const { id } = req.params;
    const post = await prisma.Record.update({
        where: { id: Number(id) },
        data: { published: true },
    })
    res.json(post.filter(post => post.Record.id === req.params))
})

app.get('/user/Record/id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const post = await prisma.Record.findMany({
        where: { id: id }
    })
    res.send(post.filter(post => post.Record.id === req.params));
})

app.delete('/user/Record/delete/:id', async (req, res) => {
    const { id } = req.params;
    const post = await prisma.Record.delete({
        where: { id, },
    })
    res.send(post);
})

app.listen(3000, () => {
    console.log("server is listening on 3000")
})