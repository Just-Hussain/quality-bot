import i18n from 'i18n'
import { Scenes, Markup } from 'telegraf'
import { MyContext } from '../myContext'
import Actions from './../constants/actions'

const locationRequest = () => {
	return Markup.keyboard([
		Markup.button.locationRequest(i18n.__('Actions.shareLocation')),
	])
}

let homeBtn = () => {
	return Markup.inlineKeyboard([
		Markup.button.callback(i18n.__('Actions.home'), Actions.START),
	])
}
export default (bot: Scenes.BaseScene<MyContext>): void => {
	bot.enter(async ctx => {
		await ctx.answerCbQuery()
		ctx.reply(i18n.__('Prompts.shareLocation'), locationRequest())
	})

	bot.on('location', async ctx => {
		console.log(ctx.message)
		ctx.session.location = { ...(ctx.message as any).location }
		await ctx.reply(i18n.__('Prompts.gotLocation'), homeBtn())
		ctx.scene.leave()
	})
}
