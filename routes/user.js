const express = require('express');
const router = express.Router();

router.get('/userList', (request, response) => {
    // response.send('<html><body><h1>List of Users</h1></body></html>')
    response.json([
        {
            fname: 'Jeram',
            lname: 'Pogi',
            age: 23,
            email: 'test@email.com'
        },
        {
            fname: 'John',
            lname: 'Doe',
            age: 35,
            email: 'test1@email.com'
        },
        {
            fname: 'Smith',
            lname: 'Wiston',
            age: 66,
            email: 'test2@email.com'
        }
    ])
});

router.post('/addUser', (request, response) => {
    // response.json(
    //     {
    //         message: 'User added Successfully!'
    //     }
    // )
    response.send(request.body)
});

module.exports = router;