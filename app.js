const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const users = require('./users.json');

const app = express();
app.use(bodyParser.json());
const PORT = 3000;

app.get('/users', (req,res) => {
    res.json(users);
})

const writeUsersData = (data) => {
    fs.writeFile('./users.json', JSON.stringify(data), err => {
        console.log(err);
    })
}

app.post('/users', (req,res) => {
    const { name , city } = req.body;
    const user_ids = users.map(u => u.id)
    console.log(user_ids);
    const id =  (user_ids.length > 0 ? Math.max(...user_ids) : 0) + 1; 
    const user = { id, name , city};
    console.log(user);
    const new_users = users.concat(user);
    
    writeUsersData(new_users);
    res.json(new_users);
})

app.put('/users/:id', (req,res) => {
    const { id } = req.params;
    // const { name, city } =req.body;

    const old_user = users.find(u => u.id == id);

    // First way
    // old_user.name = name;
    // old_user.city = city;

    // Second way , so that null is not inserted in absent data
    // if(name) old_user.name = name;
    // if(city) old_user.city = city;

    // Third way
    ['name', 'city'].forEach(key => {
        if(req.body[key]) old_user[key] = req.body[key];
    });

    writeUsersData(users);

    res.json(users);
});

app.delete('/users/:id', (req,res) => {
    const { id } = req.params;

    const new_users = users.filter(u => u.id != id);

    writeUsersData(new_users);
    res.json(new_users);
});

app.listen(PORT, (req,res) => {
    console.log(`Server running on ${PORT}`);
})