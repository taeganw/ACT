const express = require("express");
const path = require("path");
const marked = require("marked");

const app = express();
const port = 8081; // You can change the port number if needed

// Set up an Express route to send the HTML to a client
// app.get("/render", (req, res) => {
//   res.send(renderedHTML);
// });

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Define a route to serve the "index.html" file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
