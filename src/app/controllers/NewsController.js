class NewsController {
  //  [GET]  /news
  index(req, res) {
    res.render('orders');
  }

  // [GET] /news/:plug
  detail(req, res) {
    res.send('Detail page');
  }
}

module.exports = new NewsController();
