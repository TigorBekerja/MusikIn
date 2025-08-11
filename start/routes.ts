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
import { middleware } from './kernel.js'

router.get('/users', [UserController, 'index'])
router.get('/users/:id', [UserController, 'show'])
router.post('/users/login', [UserController, 'login'])
router.post('/users/register', [UserController, 'create'])

router.group(() => {
  router.delete('/users', [UserController, 'delete'])
  router.put('/users', [UserController, 'update'])
  router.post('/users/logout', [UserController, 'logout'])
  router.post('/users/profile', [UserController, 'profile'])
}).use(middleware.auth({
  guards: ['api']
}))

import MusicController from '#controllers/music_controller'

router.get('/music', [MusicController, 'index'])
router.get('/music/:id', [MusicController, 'show'])
router.post('/music/play/:id', [MusicController, 'play'])
router.group(() => {
  router.post('/music', [MusicController, 'create'])
  router.delete('/music/:id', [MusicController, 'delete'])
}).use(middleware.auth({
  guards: ['api']
}))

import HistoriesController from '#controllers/histories_controller'
router.group(() => {
  router.get('/histories', [HistoriesController, 'index'])
  router.delete('/histories/:id', [HistoriesController, 'delete'])
}).use(middleware.auth({
  guards: ['api']
}))