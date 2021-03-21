import i18n from 'i18n'
import { Scenes, Markup } from 'telegraf'
import { MyContext } from '../myContext'
import { homeBtn } from '../mixins/buttons'

let locationRequested = false

const locationRequest = () => {
	return Markup.keyboard([
		Markup.button.locationRequest(i18n.__('Actions.shareLocation')),
	]).oneTime()
}

export default (bot: Scenes.BaseScene<MyContext>): void => {
	bot.enter(async ctx => {
		await ctx.answerCbQuery()
		locationRequested = true
		ctx.reply(i18n.__('Prompts.shareLocation'), locationRequest())
	})

	bot.on('location', async ctx => {
		if (locationRequested) {
			locationRequested = false
			console.log(ctx.message)
			ctx.session.location = { ...(ctx.message as any).location }
			await ctx.reply(i18n.__('Prompts.gotLocation'), homeBtn())
			ctx.scene.leave()
		}
	})
}
