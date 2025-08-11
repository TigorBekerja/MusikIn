import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
    vine.object({
        username: vine.string().minLength(3).maxLength(50),
        email: vine.string().email().unique({ table: 'users', column: 'email' }),
        password: vine.string().minLength(6).maxLength(100),
        favorite_artist_id: vine.number().optional()
    })
)

export const updateUserValidator = vine.compile(
    vine.object({
        username: vine.string().minLength(3).maxLength(50).optional(),
        email: vine.string().email().unique({ table: 'users', column: 'email' }).optional(),
        password: vine.string().minLength(6).maxLength(100).optional(),
        favorite_artist_id: vine.number().optional()
    })
)