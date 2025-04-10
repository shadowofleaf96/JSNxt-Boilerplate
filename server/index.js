require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const path = require("path");

const app = express();

connectDB();

const port = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:4173",
  "http://localhost:3000",
  "https://shopify-admin-panel.onrender.com",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Origin",
    "X-Requested-With",
    "Accept",
    "x-client-key",
    "x-client-token",
    "x-client-secret",
    "Authorization",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    frameguard: { action: "deny" },
    noSniff: true,
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
    },
  })
);
app.disable("x-powered-by");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "2mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.redirect("https://shopify-admin-panel.onrender.com");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
