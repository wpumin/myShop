// require config
const config = require("./config/index");

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const passwordJWT = require("./middleware/passportJWT");
const checkAdmin = require("./middleware/checkAdmin");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const whitelist = ["http://nonstop-service.com"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const indexRouter = require("./routes/index");
const branchRouter = require("./routes/branch");
const staffRouter = require("./routes/staff");
const userRouter = require("./routes/user");
const goodsRouter = require("./routes/goods");

// import middleware
const errorHandler = require("./middleware/errorHandler");
const { check } = require("express-validator");
const app = express();

// app.use(cors(corsOptions));
app.use(cors());

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(helmet());
app.use(limiter);

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(logger("dev"));
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// init passport
app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/api/branch", branchRouter);
app.use("/api/staff", [passwordJWT.isLogin, checkAdmin.isAdmin], staffRouter);
app.use("/api/user", userRouter);
app.use("/api/goods", goodsRouter);

// error handler
app.use(errorHandler);

module.exports = app;
