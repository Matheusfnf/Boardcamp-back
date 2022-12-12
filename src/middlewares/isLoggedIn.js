class Categories {
  logged(req, res, next) {
    console.log("eu sou viadim");
    next();
  }
}

export default new Categories();
