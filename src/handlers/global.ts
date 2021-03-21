import i18n from 'i18n'
import { Composer, Markup } from 'telegraf'
import { MyContext } from '../myContext'
import Commands from '../constants/commands'
import Actions from '../constants/actions'
import flow from './flow'

// for global handling between different scenes.
let globalBot = new Composer<MyContext>()

// in a function so that i18n changes can reflect
const startBtn = () => {
	return Markup.inlineKeyboard([
		Markup.button.callback(i18n.__('Actions.start'), Actions.START),
	])
}
const localeBtns = () => {
	return Markup.inlineKeyboard([
		Markup.button.callback(i18n.__('Locales.arabic'), Actions.SET_AR),
		Markup.button.callback(i18n.__('Locales.english'), Actions.SET_EN),
	])
}

const optionsBtns = () => {
	return Markup.inlineKeyboard([
		[
			Markup.button.callback(
				i18n.__('Actions.shareLocation'),
				Actions.SHARE_LOCATION
			),
		],
		[
			Markup.button.callback(
				i18n.__('Actions.reviewService'),
				Actions.REVIEW_SERVICE
			),
			Markup.button.callback(
				i18n.__('Actions.reportIssue'),
				Actions.REPORT_ISSUE
			),
		],
	])
}

// Bot first time starting, stores the user locally and set the language
globalBot.start(ctx => {
	// Init the session
	ctx.scene.leave()
	ctx.session.user = { ...ctx.from }
	ctx.session.responses = ctx.session.responses || []
	ctx.session.issues = ctx.session.issues || []
	if (ctx.from.language_code) i18n.setLocale(ctx.from.language_code)
	console.log(ctx.from)

	ctx.reply(i18n.__('startMessage'), localeBtns())
})

// handles /cancel
globalBot.command(Commands.CANCEL, async ctx => {
	flow.stopFlow()
	ctx.scene.leave()
	await ctx.reply(i18n.__('Prompts.cancel'))
	await ctx.reply(i18n.__('Prompts.start'), startBtn())
})

// Handles changing language
globalBot.command(Commands.CHANGE, ctx => {
	flow.stopFlow()
	ctx.scene.leave()
	ctx.reply(i18n.__('Locales.changeLocale'), localeBtns())
})

globalBot.action(Actions.SET_AR, async ctx => {
	await ctx.answerCbQuery()
	flow.stopFlow()
	ctx.scene.leave()
	i18n.setLocale('ar')

	await ctx.reply(i18n.__('Locales.localeChanged'))
	ctx.reply(i18n.__('Prompts.start'), startBtn())
})

globalBot.action(Actions.SET_EN, async ctx => {
	await ctx.answerCbQuery()
	flow.stopFlow()
	ctx.scene.leave()
	i18n.setLocale('en')

	await ctx.reply(i18n.__('Locales.localeChanged'))
	ctx.reply(i18n.__('Prompts.start'), startBtn())
})

globalBot.action(Actions.START, async ctx => {
	ctx.answerCbQuery()
	flow.stopFlow()
	ctx.scene.leave()
	if (!ctx.session.location) {
		await ctx.reply(i18n.__('Prompts.noLocation'))
	}
	ctx.reply(i18n.__('Prompts.options'), optionsBtns())
})

export default globalBot
