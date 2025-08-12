import type { HttpContext } from '@adonisjs/core/http'
import Playlist from '#models/playlist'
import MusicInPlaylist from '#models/music_in_playlist'
import { createPlaylistValidator, updatePlaylistValidator } from '#validators/playlist'
import Music from '#models/music'

export default class PlaylistsController {
    public async create({ request, auth, response }: HttpContext) {
        if (!auth.isAuthenticated || !auth.user) {
            return response.status(401).send({ message: 'You have to login first' })
        }
        const data = await createPlaylistValidator.validate(request.only(['title', 'is_public']))
        if (data.is_public === undefined) {
            data.is_public = false
        }
        const playlist = await Playlist.create(
            { ...data, user_id: auth.user.id }
        )
        return response.status(201).send(playlist)
    }
    public async index({ auth, response }: HttpContext) {
        if (!auth.isAuthenticated || !auth.user) {
            return response.status(401).send({ message: 'You have to login first' })
        }
        const playlists = await Playlist.query().where('user_id', auth.user.id)
        return response.status(200).send(playlists)
    }
    public async show({ params, auth, response }: HttpContext) {
        if (!auth.isAuthenticated || !auth.user) {
            return response.status(401).send({ message: 'You have to login first' })
        }
        const playlistId = params.id
        const playlist = await Playlist.find(playlistId)
        const musicInPlaylist = await MusicInPlaylist.query().where('playlist_id', playlistId).preload('music')

        if (!playlist) {
            return response.status(404).send({ message: 'Playlist not found' })
        }
        if (playlist.user_id !== auth.user.id) {
            return response.status(403).send({ message: 'Forbidden: You can only view your own playlists' })
        }
        return response.status(200).send({
            playlist,
            musicInPlaylist: musicInPlaylist.map(item => item.music)
        })
    }
    public async update({auth, params, request, response }: HttpContext) {
        if (!auth.isAuthenticated || !auth.user) {
            return response.status(401).send({ message: 'You have to login first' })
        }
        const playlistId = params.id
        const playlist = await Playlist.find(playlistId)
        if (!playlist) {
            return response.status(404).send({ message: 'Playlist not found' })
        }
        if (playlist.user_id !== auth.user.id) {
            return response.status(403).send({ message: 'Forbidden: You can only update your own playlists' })
        }
        const data = await updatePlaylistValidator.validate(request.only(['title', 'is_public']))
        playlist.merge(data)
        await playlist.save()
        return response.status(200).send(playlist)
    }
    public async destroy({auth, params, response }: HttpContext) {
        if (!auth.isAuthenticated || !auth.user) {
            return response.status(401).send({ message: 'You have to login first' })
        }
        const playlistId = params.id
        const playlist = await Playlist.find(playlistId)
        if (!playlist) {
            return response.status(404).send({ message: 'Playlist not found' })
        }
        if (playlist.user_id !== auth.user.id) {
            return response.status(403).send({ message: 'Forbidden: You can only delete your own playlists' })
        }
        await playlist.delete()
        return response.status(200).send({ message: 'Playlist deleted successfully' })
    }
    public async addMusicToPlaylist({ params, request, auth, response }: HttpContext) {
        if (!auth.isAuthenticated || !auth.user) {
            return response.status(401).send({ message: 'You have to login first' })
        }
        // m_id = music id      p_id = playlist id
        const musicId = await Music.find(request.input('m_id'))
        const playlist = await Playlist.find(params.p_id)
        if (!playlist) {
            return response.status(404).send({ message: 'Playlist  not found' })
        }else if (!musicId) {
            return response.status(404).send({ message: 'Music not found' })
        }
        if (playlist.user_id !== auth.user.id) {
            return response.status(403).send({ message: 'Forbidden: You can only modify your own playlists' })
        }
        const musicInPlaylist = await MusicInPlaylist.create({
            playlist_id: playlist.id,
            music_id: musicId.id
        })
        return response.status(201).send(musicInPlaylist)
    }
    public async removeMusicFromPlaylist({ params, request, auth, response }: HttpContext) {
        if (!auth.isAuthenticated || !auth.user) {
            return response.status(401).send({ message: 'You have to login first' })
        }
        // m_id = music id      p_id = playlist id
        const musicId = await Music.find(request.input('m_id'))
        const playlist = await Playlist.find(params.p_id)
        if (!playlist) {
            return response.status(404).send({ message: 'Playlist  not found' })
        }else if (!musicId) {
            return response.status(404).send({ message: 'Music not found' })
        }
        if (playlist.user_id !== auth.user.id) {
            return response.status(403).send({ message: 'Forbidden: You can only modify your own playlists' })
        }
        const musicInPlaylist = await MusicInPlaylist.query()
            .where('playlist_id', playlist.id)
            .where('music_id', musicId.id)
            .first()
        if (!musicInPlaylist) {
            return response.status(404).send({ message: 'Music not found in playlist' })
        }
        await musicInPlaylist.delete()
        return response.status(200).send({ message: 'Music removed from playlist successfully' })
    }
}