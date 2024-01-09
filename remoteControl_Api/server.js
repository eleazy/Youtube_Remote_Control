var mysql = require("mysql");
const express = require('express');
const app = express();
const serverPort = 3000;
const cors = require('cors');

var hostname = "";
var database = "";
var port = "";
var username = "";
var password = "";

let con;
const handleDisconnect = () => {
    con = mysql.createConnection({
        host: hostname,
        user: username,
        password,
        database,
        port,
    });

    con.connect(function (err) {
        if (err) {
            console.log('ERROR CONNECT admin:', err.code + '--' + err.address);
            setTimeout(handleDisconnect, 2000);
        } else {
            console.log('Connected to DB')
        }
    });

    con.on('error', function (err) {
        console.log('ERROR admin', err.code + '--' + err.address);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log("Connection to db lost!")
            handleDisconnect();
        } else {
            console.log(err)
            throw err;
        }
    });
}

handleDisconnect();

app.use(cors());
app.use(express.json());

app.post('/api/listPost', (req, res) => {
    const { song_title, song_artist, song_image } = req.body;

    if (!song_title || !song_artist) {
        res.status(400).json({ error: 'Invalid or missing payload' });
        return;
    }

    const sqlQuery = 'INSERT INTO queueList (song_title, song_artist, song_image) VALUES (?, ?, ?)';
    const values = [song_title, song_artist, song_image];

    con.query(sqlQuery, values, function (error, results) {
        if (error) {
            console.error('Error executing the query:', error);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

app.post('/api/actionPost', (req, res) => {
    const { action } = req.body;

    if (!action) {
        res.status(400).json({ error: 'Invalid or missing payload' });
        return;
    }

    const sqlQuery = 'UPDATE actionList SET action = ?';
    var values = [action];

    con.query(sqlQuery, values, function (error, results) {
        if (error) {
            console.error('Error executing the query:', error);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

app.get('/api/dataGet', (req, res) => {
    const sqlQuery = `SELECT * FROM ${req.query.tableName}`;
    con.query(sqlQuery, (error, results) => {
        if (error) {
            console.error('Error executing query: ' + error);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

app.delete('/api/dataDelete', (req, res) => {
    const sqlQuery = `DELETE FROM ${req.query.tableName}`;

    con.query(sqlQuery, function (error, results) {
        if (error) {
            console.error('Error executing the query:', error);
            res.status(500).json({ error: 'Database error' });
            return;
        }

        res.json({ message: 'All records deleted successfully' });
    });
});

app.post('/api/videosListPost', (req, res) => {
    const { title, channel, image, duration, videoUrl } = req.body;

    if (!title) {
        res.status(400).json({ error: 'Invalid or missing payload' });
        return;
    }

    const sqlQuery = 'INSERT INTO videosList (title, channel, image, duration, videoUrl) VALUES (?, ?, ?, ?, ?)';
    const values = [title, channel, image, duration, videoUrl];

    con.query(sqlQuery, values, function (error, results) {
        if (error) {
            console.error('Error executing the query:', error);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

/* app.get('/api/getThumbnail', (req, res) => {
    const key = "";
    const title = req.query.title;
    fetch(`https://serpapi.com/search.json?engine=google_images&q=${title}&safe=active&api_key=${key}`)
        .then((response) => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then((data) => {
            console.log(title, data["images_results"][0]["original"]);
            res.json(data["images_results"][0]["original"]);
        })
        .catch((error) => {
            console.error('Fetch error:', error);
        });
}); */

app.listen(serverPort, () => {
    console.log(`Server is running at port ${serverPort}`);
});
