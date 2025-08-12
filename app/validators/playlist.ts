import vine from '@vinejs/vine'

export const createPlaylistValidator = vine.compile(
    vine.object({
        title : vine.string().minLength(2).maxLength(100),
        is_public : vine.boolean({strict: true}).optional()
    })
)
export const updatePlaylistValidator = vine.compile(
    vine.object({
        title : vine.string().minLength(2).maxLength(100).optional(),
        is_public : vine.boolean({strict: true}).optional()
    })
)