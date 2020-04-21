const express = require('express');
const fs = require('fs');
const app = express();
var PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('listening at 3000'));
app.use(express.static('Public'));
app.use(express.json({ limit: '1mb'}));

app.post('/api', (request, response) => {
    // let info = JSON.stringify(request.body, null, indent = 2);
    fs.readFile('info.json', function (err, data) {
        var json = JSON.parse(data);
        json.push(request.body);
    console.log(json);
    fs.writeFile('info.json', JSON.stringify(json, null, indent = 2),'utf-8', function(err) {
        if (err) throw err
        console.log('Done!')
    })
    })
    response.end()
});

app.get('/', (request, response) => {
    response.sendFile('index.html', {root: __dirname })
});

app.get('/found.html', (request, response) => {
    response.sendFile('found.html', {root: __dirname })
});

app.get('/seeking.html', (request, response) => {
    response.sendFile('seeking.html', {root: __dirname })
});

app.get('/data', (request, response) => {
    response.sendFile('info.json', {root: __dirname });
});

