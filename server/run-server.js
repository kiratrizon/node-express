const app = require('./server');
require('dotenv').config();

const port = process.env.PORT || 2500;

app.listen(port, (req, res) => {
    console.log(`Server is running on port http://localhost:${port}`);
});