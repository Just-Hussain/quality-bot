import i18n from 'i18n'
import { Telegraf, Markup, Scenes } from 'telegraf'
import { MyContext } from '../myContext'
import { Issue } from '../models'
import flow from './flow'
import Actions from '../constants/actions'
import Commands from '../constants/commands'

let commentRequested: boolean = false
let comment: string

const startBtn = () => {
	return Markup.inlineKeyboard([
		Markup.button.callback(i18n.__('Actions.start'), Actions.START),
	])
}

export default (bot: Scenes.BaseScene<MyContext>): void => {
	bot.enter(async ctx => {
		flow.startFlow()

		await ctx.reply(i18n.__('Prompts.reportIssue'))
		await ctx.reply(i18n.__('Prompts.Issue.comment'))
	})

	bot.command(Commands.CANCEL, async ctx => {
		flow.stopFlow()
		await ctx.reply(i18n.__('Prompts.cancel'))
		await ctx.reply(i18n.__('Prompts.start'), startBtn())
		ctx.scene.leave()
	})
}
