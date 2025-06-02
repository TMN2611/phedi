class SiteController {
  //  [GET]  /
  index(req, res) {

    const DISCOUNTPERCENT = Number(process.env.DISCOUNTPERCENT)
    res.render('home',{DISCOUNTPERCENT});
  }

  // [GET] /doidiem
  doidiem(req, res) {
    res.render('doidiem');
  }
}

module.exports = new SiteController();
