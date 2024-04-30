const express = require("express");
const app = express();
const useragent = require("express-useragent");

app.use(express.json());
app.use(express.static("public")); // Serve static files
app.use(useragent.express());

const linkRoutes = require("./routes/linkRoutes");
const clickRoutes = require("./routes/clickRoutes");
const redirectRoutes = require("./routes/redirectRoutes");

app.use(express.json());

app.use("/api/links", linkRoutes);
app.use("/api/clicks", clickRoutes);
app.use("/", redirectRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const fs = require("fs");
const path = require("path");
