const express = require("express");
const cors = require("cors");
const server = express();
const router = require("../src/router");
const PORT = 4000;
const { initDB } = require("../src/db");

server.use(express.json());
server.use(cors());
server.use(`/api`, router);

server.listen(PORT, () => {
  initDB();
  console.log(`el servidor esta escuchando en el puerto: ${PORT}`);
});
