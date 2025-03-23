class SiteController {
  //  [GET]  /
  index(req, res) {

    const DISCOUNTPERCENT = Number(process.env.DISCOUNTPERCENT)
    console.log("🚀 ~ SiteController ~ index ~ DISCOUNTPERCENT:", DISCOUNTPERCENT)
    res.render('home',{DISCOUNTPERCENT});
  }

  // [GET] /search
  search(req, res) {
    res.render('search');
  }
}

module.exports = new SiteController();
