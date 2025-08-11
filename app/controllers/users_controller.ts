import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'
import Hash from '@adonisjs/core/services/hash'

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
        return response.status(201).send({
            message : 'User created successfully',
            user,
        })
    }
    
    public async update({request, auth, response }: HttpContext) {
        const userData = await updateUserValidator.validate(request.only(['username', 'email', 'password', 'favorite_artist_id']))
        if (!auth.isAuthenticated) {
            return response.status(401).send({ message: 'Unauthorized' })
        }

        auth.user?.merge(userData)
        await auth.user?.save()
        return response.status(200).send(auth.user)
    }
    
    public async delete({auth, response }: HttpContext) {
        if (!auth.isAuthenticated) {
            return response.status(401).send({ message: 'Unauthorized' })
        }
        await auth.user?.delete()
        return response.status(200).send({ message: 'User deleted successfully' })
    }

    public async login({ request, response }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])
        const user = await User.query().where('email', email).first()

        if (!user) {
            return response.status(401).send({ message: 'Invalid credentials' })
        }

        const isPasswordValid = await Hash.verify(user.password, password)
        if (!isPasswordValid) {
            return response.status(401).send({ message: 'Invalid credentials' })
        }

        const token = await User.accessTokens.create(user)
        return response.status(200).send({
            message: 'Login successful',
            user,
            token,
        })
    }

    public async profile({ auth, response }: HttpContext) {
        if (!auth.isAuthenticated) {
            return response.status(401).send({ message: 'Unauthorized' })
        }
        return response.status(200).send(auth.user)
    }

    public async logout({ auth, response }: HttpContext) {
        if (!auth.isAuthenticated) {
            return response.status(401).send({ message: 'Unauthorized' })
        }
        await auth.use('api').invalidateToken()
        return response.status(200).send({ message: 'Logged out successfully' })
    }
}