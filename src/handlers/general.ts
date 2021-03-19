import i18n from 'i18n'
import { Telegraf, Markup } from 'telegraf'
import { MyContext } from '../myContext'
import Actions from '../constants/actions'
import Commands from '../constants/commands'
import flow from './flow'

export default (bot: Telegraf<MyContext>): void => {
	const localeBtns = Markup.inlineKeyboard([
		Markup.button.callback(i18n.__('Locales.arabic'), Actions.SET_AR),
		Markup.button.callback(i18n.__('Locales.english'), Actions.SET_EN),
	])

	// in a function so that i18n changes can reflect
	const startBtn = () => {
		return Markup.inlineKeyboard([
			Markup.button.callback(i18n.__('Actions.start'), Actions.START),
		])
	}

	const optionsBtns = () => {
		return Markup.inlineKeyboard([
			Markup.button.callback(
				i18n.__('Actions.reviewService'),
				Actions.REVIEW_SERVICE
			),
			Markup.button.callback(
				i18n.__('Actions.reportIssue'),
				Actions.REPORT_ISSUE
			),
		])
	}

	// Bot first time starting, stores the user locally and set the language
	bot.start(ctx => {
		// Init the session
		ctx.session.user = { ...ctx.from }
		ctx.session.responses = ctx.session.responses || []
		ctx.session.issues = ctx.session.issues || []
		ctx.session.location = ctx.session.location || 'No Location'

		if (ctx.from.language_code) i18n.setLocale(ctx.from.language_code)
		console.log(ctx.from)

		ctx.reply(i18n.__('startMessage'), localeBtns)
	})

	// handles /help
	bot.help(ctx => {
		flow.stopFlow()
		ctx.reply('Here is some help')
	})

	// handles /cancel
	bot.command(Commands.CANCEL, async ctx => {
		flow.stopFlow()
		await ctx.reply(i18n.__('Prompts.cancel'))
		ctx.reply(i18n.__('Prompts.start'), startBtn())
	})

	// Handles changing language
	bot.command(Commands.CHANGE, ctx => {
		flow.stopFlow()
		ctx.reply(i18n.__('Locales.changeLocale'), localeBtns)
	})

	bot.action(Actions.SET_AR, async ctx => {
		await ctx.answerCbQuery()
		flow.stopFlow()
		i18n.setLocale('ar')

		await ctx.reply(i18n.__('Locales.localeChanged'))
		ctx.reply(i18n.__('Prompts.start'), startBtn())
	})

	bot.action(Actions.SET_EN, async ctx => {
		await ctx.answerCbQuery()
		flow.stopFlow()
		i18n.setLocale('en')

		await ctx.reply(i18n.__('Locales.localeChanged'))
		ctx.reply(i18n.__('Prompts.start'), startBtn())
	})

	bot.action(Actions.START, ctx => {
		flow.stopFlow()
		ctx.answerCbQuery()
		ctx.reply(i18n.__('Prompts.options'), optionsBtns())
	})
}
