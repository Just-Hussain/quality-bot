import i18n from 'i18n'
import { Telegraf, Context, Markup } from 'telegraf'
import { MyContext } from '../myContext'
import { Issue } from '../models'
import flow from './flow'
import Actions from '../constants/actions'

let commentRequested: boolean = false
let comment: string

export default (bot: Telegraf<MyContext>): void => {
	bot.action(Actions.REPORT_ISSUE, async ctx => {
		await ctx.answerCbQuery()
		flow.startFlow()

		await ctx.reply(i18n.__('Prompts.reportIssue'))
		await ctx.reply(i18n.__('Prompts.Issue.comment'))
	})
}
