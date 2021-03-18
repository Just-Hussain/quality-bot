import i18n from 'i18n'
import { Telegraf, Context, Markup } from 'telegraf'
import Actions from '../constants/actions'
import Commands from '../constants/commands'

export default (bot: Telegraf): void => {
	const localeBtns = Markup.inlineKeyboard([
		Markup.button.callback(i18n.__('Locales.arabic'), Actions.SET_AR),
		Markup.button.callback(i18n.__('Locales.english'), Actions.SET_EN),
	])

	// Bot first time starting
	bot.start(ctx => {
		let msg = i18n.__('startMessage')

		return ctx.reply(msg, localeBtns)
	})

	bot.help(ctx => {
		ctx.reply('Here is some help')
	})

	bot.command(Commands.CHANGE, ctx => {
		ctx.reply(i18n.__('Locales.changeLocale'), localeBtns)
	})

	bot.action(Actions.SET_AR, async ctx => {
		await ctx.answerCbQuery()
		i18n.setLocale('ar')
		ctx.reply(i18n.__('Locales.localeChanged'))
	})

	bot.action(Actions.SET_EN, async ctx => {
		await ctx.answerCbQuery()
		i18n.setLocale('en')
		ctx.reply(i18n.__('Locales.localeChanged'))
	})
}
