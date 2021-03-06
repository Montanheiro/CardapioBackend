module.exports = (app)=>{
  const controller = app.controllers.CategoryController;
  const JWTPolicy = require('../lib/jwtVerify.js');

  app.get('/category/findByCompany', controller.findByCompany);
  app.get('/category/findAllByCompany',JWTPolicy, controller.findAllByCompany);
  app.post('/category/new', JWTPolicy, controller.new);
  app.post('/category/edit', JWTPolicy, controller.edit);
  app.post('/category/changeStatus', JWTPolicy, controller.changeStatus);
  app.post('/category/changePosition', JWTPolicy, controller.changePosition);
  app.post('/category/remove', JWTPolicy, controller.remove);

}
