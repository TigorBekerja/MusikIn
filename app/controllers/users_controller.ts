import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'

export default class UsersController {
    public async index({ response }: HttpContext) {
        const users = await User.all()
        return response.status(200).send(users)
    }
    
    public async show({ params, response }: HttpContext) {
        const userId = params.id
        const user = await User.find(userId)
        if (!user) {
            return response.status(404).send({ message: 'User not found' })
        }
        return response.status(200).send(user)
    }
    
    public async create({ request, response }: HttpContext) {
        const userData = await createUserValidator.validate(request.only(['username', 'email', 'password', 'favorite_artist_id']))
        const user = await User.create(userData)
        return response.status(201).send(user)
    }
    
    public async update({ params, request, response }: HttpContext) {
        const userData = await updateUserValidator.validate(request.only(['username', 'email', 'password', 'favorite_artist_id']))
        const userId = params.id
        const user = await User.find(userId)
        if (!user) {
            return response.status(404).send({ message: 'User not found' })
        }
        user.merge(userData)
        await user.save()
        return response.status(200).send(user)
    }
    
    public async delete({ params, response }: HttpContext) {
        const userId = params.id
        const user = await User.find(userId)
        if (!user) {
            return response.status(404).send({ message: 'User not found' })
        }
        await user.delete()
        return response.status(200).send({ message: 'User deleted successfully' })
    }
}