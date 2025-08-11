import vine from '@vinejs/vine'

export const createMusicValidator = vine.compile(
    vine.object({
        title: vine.string().minLength(2).maxLength(100),
        genre: vine.string().minLength(2).maxLength(50),
        duration: vine.number().min(1),
        year: vine.number().min(1900).max(new Date().getFullYear()).optional(),
    })
)