require('dotenv').config()
import path from 'path'
import { Telegraf } from 'telegraf'
import i18n from 'i18n'
import handlers from './handlers'

// Exit if no token is provided
const token = process.env.BOT_TOKEN
if (token === undefined) {
	throw new Error('BOT_TOKEN must be provided in .env')
}

// Setup

// Configure i18n singleton
i18n.configure({
	directory: path.join(__dirname, '/locales'),
	defaultLocale: 'ar',
	objectNotation: true,
})

// init the bot
const bot = new Telegraf(token)
// bot.use(Telegraf.log())

// Passes the bot instance to the responsible modules
handlers(bot)

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

// Start the bot
bot.launch()
console.log('Up & Running')
