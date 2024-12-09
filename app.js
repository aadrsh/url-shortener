const express = require("express");
const cors = require("cors");
const session = require("express-session");
const useragent = require("express-useragent");
const {passport} = require("./auth");
const { authMiddleware,roleMiddleware } = require("./middlewares");

const webApp = express();
webApp.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}));


webApp.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));
webApp.use(useragent.express());
webApp.use(passport.initialize());
webApp.use(passport.session());
webApp.use(express.json());
webApp.use(express.static("public")); // Serve static files

const linkRoutes = require("./routes/linkRoutes");
const clickRoutes = require("./routes/clickRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

webApp.use("/private",authMiddleware,express.static( "private"));

webApp.use("/api/links", authMiddleware,linkRoutes);
webApp.use("/api/clicks", authMiddleware, clickRoutes);
webApp.use("/auth", authRoutes);
webApp.use("/api/users", authMiddleware, roleMiddleware('admin'), userRoutes);

webApp.get('/', (req, res) => {
    //check authentication and then redirect accordingly
    if (req.isAuthenticated() && req.user.role === 'admin') {
        res.redirect('/dashboard');
    } else if(req.isAuthenticated() && req.user.role === 'user') {
        res.redirect('/userview');
    } else {
        res.redirect('/login');
    }
});

webApp.get('/login', (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

webApp.get('/dashboard', authMiddleware,roleMiddleware("admin"), (req,res) => {
    res.sendFile(__dirname + "/private/dashboard.html");
});

webApp.get('/authfailed', (req, res) => {
    res.sendFile(__dirname + "/public/authfailed.html");
});

webApp.get('/brokenlink', (req, res) => {
    res.sendFile(__dirname + "/public/brokenlink.html");
});

webApp.get('/manageusers', authMiddleware, roleMiddleware('admin'), (req, res) => {
    res.sendFile(__dirname + "/private/manageusers.html");
});

webApp.get('/analytics', authMiddleware, (req, res) => {
    res.sendFile(__dirname + "/private/analytics.html");
});

webApp.get('/userview', authMiddleware, (req, res) => {
    res.sendFile(__dirname + "/private/userview.html");
});

webApp.get('/*', (req, res) => {
    res.sendFile(__dirname + "/public/404.html");
});

const WEB_SERVER_PORT = process.env.WEB_SERVER_PORT || 3000;
webApp.listen(WEB_SERVER_PORT, () => console.log(`Server running on port ${WEB_SERVER_PORT}`));


// ######################################################## //
const redirectRoutes = require("./routes/redirectRoutes");
const REDIRECT_SERVER_URL = process.env.REDIRECT_SERVER_URL || "http://localhost:3001";
const REDIRECT_SERVER_PORT = process.env.REDIRECT_SERVER_PORT || 3001;

const redirectApp = express();
redirectApp.use(useragent.express());
redirectApp.use("/", redirectRoutes);

redirectApp.listen(REDIRECT_SERVER_PORT, () => console.log(`Redirect server running on port ${REDIRECT_SERVER_PORT}`));

