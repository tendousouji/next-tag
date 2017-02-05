import UserController from './userController';

exports.routes = (kernel) => {
  let userController = new UserController(kernel);

  kernel.app.get('/api/v1/users/me', kernel.middleware.isAuthenticated(), userController.me);
  kernel.app.put('/api/v1/users/:id/password', kernel.middleware.isAuthenticated(), userController.changePassword);
  kernel.app.post('/api/v1/users', userController.create);
  kernel.app.delete('/api/v1/users/:id', kernel.middleware.hasRole('admin'), userController.destroy);
  kernel.app.get('/api/v1/users', kernel.middleware.hasRole('admin'), userController.index);
};