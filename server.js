require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello HNG11!')
})

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;