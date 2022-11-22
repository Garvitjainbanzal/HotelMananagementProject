const { PrismaClient } = require('@prisma/client');
const express = require('express');
const prisma = new PrismaClient();
const app = new express();

app.use(express.json());

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

app.get('/Account/login', async (req, res) => {
    const { email, password } = req.params;
    const post = await prisma.User.findMany({
        where: { email: email, password: password },
    })
    res.send(post)
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
    res.json(post)
})

app.get('/user/Record/id', async (req, res) => {
    const { id } = req.params;
    const post = await prisma.Record.findMany({
        where: { id: id }
    })
    res.send(post)
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