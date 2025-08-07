/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

import UserController from '#controllers/users_controller'

router.get('/users', [UserController, 'index'])
router.get('/users/:id', [UserController, 'show'])
router.post('/users', [UserController, 'create'])
router.put('/users/:id', [UserController, 'update'])
router.delete('/users/:id', [UserController, 'delete'])
router.post('/users/login', [UserController, 'login'])
router.post('/users/register', [UserController, 'create'])
