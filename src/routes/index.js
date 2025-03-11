const newsRouter = require('./news');
const siteRouter = require('./site');
const ordersRouter = require('./order');
const apisRouter = require('./apis');


function route(app) {
  // http method

  app.use('/news', newsRouter);
  app.use('/order', ordersRouter);
  app.use('/api', apisRouter);

  app.use('/', siteRouter);
}

module.exports = route;
