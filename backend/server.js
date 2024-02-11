const express = require('express');
require('./connection/conn')
require('dotenv').config();

const cors = require('cors');

const appRoutes = require('./routes/routes');

const app = express();
const port = process.env.PORT || 3000;



app.use(cors());
app.use(express.json());
app.use(appRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
