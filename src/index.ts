require('dotenv').config()
import path from 'path'
import { Telegraf } from 'telegraf'
import { MyContext } from './myContext'
import LocalSession from 'telegraf-session-local'
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

// configure the local session
const localSession = new LocalSession({
	storage: LocalSession.storageFileAsync,
})

// init the bot
const bot = new Telegraf<MyContext>(token)
// bot.use(Telegraf.log())
bot.use(localSession.middleware())

// Passes the bot instance to the responsible modules

handlers(bot)

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

// Start the bot
bot.launch()
console.log('Up & Running')
