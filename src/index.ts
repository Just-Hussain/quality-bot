require('dotenv').config()
import path from 'path'
import { Telegraf } from 'telegraf'
import i18n from 'i18n'
import TelegrafModules from './modules'

i18n.configure({
	directory: path.join(__dirname, '/locales'),
	defaultLocale: 'en',
	objectNotation: true,
})

// Setup
const token = process.env.BOT_TOKEN
if (token === undefined) {
	throw new Error('BOT_TOKEN must be provided in .env')
}
const bot = new Telegraf(token)
// bot.use(Telegraf.log())

// Passes the bot instance to the responsible modules
TelegrafModules(bot)

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

// Start the bot
bot.launch()
console.log('up')
