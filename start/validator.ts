import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  'required': 'The {{ field }} field is required',
  'string': 'The {{ field }} field must be a string',
  'minLength': 'The {{ field }} field must be at least {{ min }} characters long',
  'maxLength': 'The {{ field }} field must not exceed {{ max }} characters long',
  'email': 'The {{ field }} field must be a valid email address',
  'unique': 'The {{ field }} field must be unique',
  'number': 'The {{ field }} field must be a number',
  'min': 'The {{ field }} field must be at least {{ min }}',
})
