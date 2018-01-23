const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000; //we want our express server listen to heroku provided port or port 3000 if there are not 

app.use(express.static(publicPath));

app.get('*', (req, res)=>{
    res.sendFile(path.join(publicPath, 'index.html'));
})

app.listen(port, ()=>{ //provide the port here
    console.log('server is up');
});  