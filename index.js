require('dotenv').config();
const express = require('express');
const path = require('path');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const main = require('./routes/main');
const instaled = require('./routes/instaled');

const app = express();

app.disable('x-powered-by');

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/main', main);
app.use('/instaled', instaled);

const PORT = process.env.PORT || 5000;

function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
