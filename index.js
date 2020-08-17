
const express = require('express');
const app = express();

app.use(express.static(__dirname));
app.get('/', function (request, response) {
  response.redirect('/register');
});
app.listen(process.env.PORT || 4300);

console.log(`Ngena Server is Listening on port 4300`);
