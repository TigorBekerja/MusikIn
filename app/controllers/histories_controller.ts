import type { HttpContext } from '@adonisjs/core/http'
import History from '#models/history'


export default class HistoriesController {
    public async index({ auth, request, response }: HttpContext) {
        if (!auth.authenticate || !auth.user) {
            return { error: 'Unauthorized' }
        }
        const userId = auth.user.id
        const page = request.input('page', 1)
        const limit = request.input('limit', 10)

        const histories = await History.query()
            .where('user_id', userId)
            .orderBy('updatedAt', 'desc')
            .preload('user')
            .preload('music')
            .paginate(page, limit)

        return response.status(200).send(histories)
    }
    public async delete({ params, auth, response }: HttpContext) {
        if (!auth.isAuthenticated) {
            return response.status(401).send({ message: 'Unauthorized' })
        }
        const historyId = params.id
        const historyItem = await History.find(historyId)
        if (!historyItem) {
            return response.status(404).send({ message: 'History not found' })
        }
        if (historyItem.user_id !== auth.user?.id) {
            return response.status(403).send({ message: 'Forbidden: You can only delete your own history' })
        }
        await historyItem.delete()
        return response.status(200).send({ message: 'History deleted successfully' })
    }
}