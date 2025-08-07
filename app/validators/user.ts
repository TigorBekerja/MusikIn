import vine, {SimpleMessagesProvider} from '@vinejs/vine'

const messages = { 
    required: 'The {{ field }} field is required',
    string: 'The {{ field }} field must be a string',
    minLength : 'The {{ field }} field must be at least {{ min }} characters long',
    maxLength : 'The {{ field }} field must not exceed {{ max }} characters long',
    email : 'The {{ field }} field must be a valid email address',
    unique : 'The {{ field }} field must be unique',
}

vine.messagesProvider = new SimpleMessagesProvider(messages)

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

