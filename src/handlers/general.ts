import i18n from 'i18n'
import { Telegraf, Context, Markup } from 'telegraf'
import { MyContext } from '../myContext'
import Actions from '../constants/actions'
import Commands from '../constants/commands'

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

	// Bot first time starting
	bot.start(ctx => {
		ctx.reply(i18n.__('startMessage'), localeBtns)
	})

	// handles /help
	bot.help(ctx => {
		ctx.reply('Here is some help')
	})

	// handles /cancel
	bot.command(Commands.CANCEL, async ctx => {
		await ctx.reply(i18n.__('Prompts.cancel'))
		ctx.reply(i18n.__('Prompts.start'), startBtn())
	})

	// Handles change language
	bot.command(Commands.CHANGE, ctx => {
		ctx.reply(i18n.__('Locales.changeLocale'), localeBtns)
	})

	bot.action(Actions.SET_AR, async ctx => {
		await ctx.answerCbQuery()
		i18n.setLocale('ar')

		await ctx.reply(i18n.__('Locales.localeChanged'))
		ctx.reply(i18n.__('Prompts.start'), startBtn())
	})

	bot.action(Actions.SET_EN, async ctx => {
		await ctx.answerCbQuery()
		i18n.setLocale('en')

		await ctx.reply(i18n.__('Locales.localeChanged'))
		ctx.reply(i18n.__('Prompts.start'), startBtn())
	})

	bot.action(Actions.START, ctx => {
		ctx.answerCbQuery()
		ctx.reply(i18n.__('Prompts.options'), optionsBtns())
	})
}
