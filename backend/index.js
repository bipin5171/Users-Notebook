const connectToMongo = require('./db');
const express = require('express');
 var cors = require('cors'); // Import cors package
connectToMongo();

const app = express();
const port = 5000;
 
app.use(cors()); // Use cors middleware
app.use(express.json());

// Available routes
app.use(`/api/auth`, require(`./routes/auth`));
app.use(`/api/notes`, require(`./routes/notes`));

app.listen(port, () => {
  console.log(`iNotebook backend app listening at http://localhost:${port}`);
});
