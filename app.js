var path = require('path');
var logger = require('morgan');
var multer = require('multer');
var moment = require('moment');
var express = require('express');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var exphbs  = require('express-handlebars');
const adminRoutes = require('./routes/admin');
const config = require('./config');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
 
const upload = multer({ storage: storage });

var DateFormats = {
  monthYear: "MM YYYY",
  long: "dddd DD.MM.YYYY HH:mm"
};

const helpers = {
  times: function(n, block) {
    let accum = '';
    for(let i = 1; i <= n; i++)
        accum += block.fn(i);
    return accum;
  },
  ifCond: function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
  },
  isdefined: function(value, options) {
    if (value !== undefined || value !== null) return options.fn(this);
    else { return options.inverse(this); }
  },
  math: function(lvalue, operator, rvalue) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
  },
  equalsTo: function(v1, v2, options) { 
    if(v1 == v2) { return options.fn(this); } 
    else { return options.inverse(this); } 
  },
  isnotdefined: function(value) {
    // console.log('isnotdefined ', (value === undefined || value === null));
    return (value === undefined || value === null);
  },
  dateFormat: function(datetime, format) {
    // can use other formats like 'lll' too
    format = DateFormats[format] || format;
    return moment(datetime).format(format);
  },
  ifIn: function(elem, list, options) {
    if(list.indexOf(elem) > -1) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  apiUrl: function() {
    return config.apiUrl
  },
  dotdotdot: function(string) {
    if (string.length > 10)
    return string.substring(0,10) + '..';
  return string;
  }
};

var app = express();
app.upload = upload;

const router = express.Router();

var hbs = exphbs.create({ 
  helpers,
//   defaultLayout: 'main',
//   extname: '.handlebars',
//   layoutsDir: path.join(__dirname, 'layouts')
 });

// Register `hbs.engine` with the Express app.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

const indexRouter = require('./routes/index')(app, router);

app.use('/', indexRouter);
app.use('/admin', adminRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('404-error');
});

module.exports = app;
