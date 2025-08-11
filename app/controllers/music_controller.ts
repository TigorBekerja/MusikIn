import type { HttpContext } from '@adonisjs/core/http'
import music from '#models/music'
import { createMusicValidator } from '#validators/music'
import History from '#models/history'

export default class MusicInPlaylistsController {
    public async index({ request, response }: HttpContext) {
        const page = request.input('page', 1)
        const limit = request.input('limit', 10)
        const genre = request.input('genre')

        const query = music.query()

        if (genre) {
            query.where('genre', genre)
        }

        const musicList = await query.paginate(page, limit)


        return response.status(200).send(musicList)
    }
    public async show({ params, response }: HttpContext) {
        const musicId = params.id
        const musicItem = await music.find(musicId)
        if (!musicItem) {
            return response.status(404).send({ message: 'Music not found' })
        }
        return response.status(200).send(musicItem)
    }
    public async create({ request, auth, response }: HttpContext) {
        if (!auth.isAuthenticated) {
            return response.status(401).send({ message: 'Unauthorized' })
        }
        const musicData = await createMusicValidator.validate(request.only(['title', 'genre', 'duration', 'year']))
        if (!musicData.year) {
            musicData.year = new Date().getFullYear() // Default to current year if not provided
        }
        const newMusic = await music.create({
            ...musicData,
            artist_id: auth.user?.id, // user become the artist
        })
        return response.status(201).send({
            message: 'Music created successfully',
            music: newMusic,
        })
    }
    public async delete({ params, auth, response }: HttpContext) {
        if (!auth.isAuthenticated) {
            return response.status(401).send({ message: 'Unauthorized' })
        }
        const musicId = params.id
        const musicItem = await music.find(musicId)
        if (!musicItem) {
            return response.status(404).send({ message: 'Music not found' })
        }
        if (musicItem.artist_id !== auth.user?.id) {
            return response.status(403).send({ message: 'Forbidden: You can only delete your own music' })
        }
        await musicItem.delete()
        return response.status(200).send({ message: 'Music deleted successfully' })
    }
    public async play({ params, auth, response }: HttpContext) {
        const musicId = params.id
        const musicItem = await music.find(musicId)
        if (!musicItem) {
            return response.status(404).send({ message: 'Music not found' })
        }
        musicItem.num_played += 1 // Increment the play count
        await musicItem.save()

        try {
            await auth.authenticate()
        } catch (error) {
            return response.status(200).send({ message: 'Authentication failed, playing music without history', music: musicItem })
        }
        
        if (auth.isAuthenticated && auth.user) {
            const history = await History.query().where({
                user_id: auth.user.id,
                music_id: musicItem.id
            }).first()
            if (history) {
                history.num_played += 1 // Increment the play count in history
                await history.save()
            } else {
                await History.create({
                    user_id: auth.user.id,
                    music_id: musicItem.id,
                    num_played: 1
                })
            }
        }
        return response.status(200).send({ message: 'Playing music', music: musicItem })
    }
}