const express = require('express');
const app = express();
const port = 8000;
const Swal = require('sweetalert2')

const path = require("path");
const mySQL = require("mysql2");

const db = mySQL.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '1234567890', // Password for the 'root' user
        port: 3306,     // Port number in work bench
        database: 'fruitshop' // Database name
    }
);

app.use(express.json());
app.use(express.urlencoded(
    {
        extended: true
    }
));

// __dirname = environment variable that tells the absolute path of the file you are working on (e.g. App.js)
app.use(express.static(path.join(__dirname, './public')));

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, "./public/index.html"));
});

// POST method to Add New Item to the database
app.post('/addFruits', (request, response) => {
    db.query("INSERT INTO fruits (fruits_name, instock, unit_id,        created_by, updated_by) VALUES (?, ?, ?, ?, ?)",
        [
            request.body.fruits_name,
            request.body.instock,
            request.body.unit_id,
            1,
            1
        ],
        (err) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log(`A new fruit has been added`);
            }
        }
    )
    
});

// POST method to Search Existing fruit from the database/target table
app.post('/searchFruits', (request, response) => {
    db.query(
        "SELECT * FROM fruits WHERE fruits_id = ?",
        [request.body.fruits_id],
        (error, data) => {
            if (data.length == 0) {
                    response.send(`Unable to find the ID of the specified fruit`)
            }

            let row = data[0];

            response.send(`Fruit ID: ${row.fruits_id} \nFruit Name: ${row.fruits_name}`)
        }
    )
});

// POST method to update existing fruit id/name from the database/target table
app.post('/updateFruits', (request, response) => {
    db.query(
        "UPDATE fruits SET fruits_name = ? WHERE fruits_id = ?",
        [
            request.body.fruits_name,
            request.body.fruits_id
        ],
        (err) => {
            if (err) {
                response.send("Failed to delete the fruit name")
            } else {
                response.send(`Successfully Updated the fruit name to ${request.body.fruits_name} `)
            }
        }
    )
});

// POST method to delete existing fruit id/name from database/target table
app.post('/deleteFruits', (request, response) => {
    db.query(
        "DELETE FROM fruits WHERE fruits_id = ?",
        [
            request.body.fruits_id
        ],
        (err) => {
            if (err) {
                response.send("Failed to delete the fruit name")
            } else {
                response.send(`Successfully Deleted the fruit name to ${request.body.fruits_id} `)
            }
        }
    )
});

// GET method to display all the data in a tabular format
app.get('/tableFruits', (request, response) => {
    db.query(
        "CALL list_fruits()",
        (err, data) => {
            const row = data[0];

            let htmlData = 
            `<table>
                <thead>
                    <tr>
                        <th>Fruit ID</th>
                        <th>Fruit Name</th>
                        <th>Instock</th>
                    </tr>
                </thead>`;
            
            for (let i = 0; i <row.length; i++) {
                htmlData +=
                 `<tbody>
                    <tr>
                        <td>${row[i].fruits_id}</td>
                        <td>${row[i].fruits_name}</td>
                        <td>${row[i].instock}</td>
                    </tr>`
            };

            htmlData += `</tbody>
            </table>`;

            if (err) {
                console.log(err.message)
            } else {
                response.send(htmlData)
            }
        }
    )
})



app.listen(port, () => {
    // Message when successfully connected to the ExpessJS Server
    console.log(`\nServer successfully started\nPort: ${port}`);

    // Determines the success / failure of connection to the Local Database
    db.connect((error) => {
        if (error) {
            console.log(`Unable to connect to the database\n${error}`);
        } else {
            console.log(`\nSuccessfully connected to the database`);
        }
    });
    // Message Execute during failure to connect to the server
}).on("error", (err) => {
    console.error(`Server failed to start\nError: ${err}`);
});



