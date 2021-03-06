require('dotenv').config()
import path from 'path'
import { Telegraf, Scenes } from 'telegraf'
import { MyContext } from './myContext'
import LocalSession from 'telegraf-session-local'
import i18n from 'i18n'
import handlers from './handlers'
import './locales/ar.json'
import './locales/en.json'
// Exit if no token is provided
const token = process.env.BOT_TOKEN
if (token === undefined) {
	throw new Error('BOT_TOKEN must be provided in .env')
}

// Setup

// init the bot
const bot = new Telegraf<MyContext>(token)

// configure the local session
const localSession = new LocalSession({
	storage: LocalSession.storageFileAsync,
})
bot.use(localSession.middleware())

// Configure stage
let stage = new Scenes.Stage<MyContext>()
bot.use(stage.middleware())

// Configure i18n singleton
i18n.configure({
	directory: path.join(__dirname, './locales'),
	defaultLocale: 'en',
	objectNotation: true,
})

// Passes the bot and stage instances to the responsible handlers
try {
	handlers(bot, stage)
} catch (e) {
	console.log(e)
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

// Start the bot
bot.launch()
console.log('Up & Running')
