import i18n from 'i18n'
import { Markup, Scenes } from 'telegraf'
import { MyContext } from '../myContext'
import { Issue } from '../models'
import { downloadFile } from '../utils'
import flow from './flow'
import Actions from '../constants/actions'
import Commands from '../constants/commands'

let commentRequested: boolean = false
let photoRequested: boolean = false
let comment: string | undefined
let issue: Issue = new Issue('')

const startBtn = () => {
	return Markup.inlineKeyboard([
		Markup.button.callback(i18n.__('Actions.start'), Actions.START),
	])
}

let nextBtn = () => {
	return Markup.inlineKeyboard([
		Markup.button.callback(i18n.__('Actions.next'), Actions.NEXT),
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
		flow.startFlow()

		comment = undefined
		commentRequested = true
		issue = new Issue('')

		await ctx.reply(i18n.__('Prompts.reportIssue'))
		await ctx.reply(i18n.__('Prompts.Issue.comment'))
	})

	bot.command(Commands.CANCEL, async ctx => {
		flow.stopFlow()
		await ctx.reply(i18n.__('Prompts.cancel'))
		await ctx.reply(i18n.__('Prompts.start'), startBtn())
		ctx.scene.leave()
	})

	bot.on('text', async ctx => {
		if (flow.isFlowing) {
			let message: any = ctx.message

			if (commentRequested && message.text) {
				comment = message.text as string
				issue.comment = comment
				commentRequested = false
				photoRequested = true
				await ctx.reply(i18n.__('Prompts.Issue.photo'), nextBtn())
			}
		}
	})

	bot.on('photo', async ctx => {
		if (flow.isFlowing) {
			let message: any = ctx.message

			if (photoRequested && message.photo) {
				flow.stopFlow()
				photoRequested = false
				// There are multiple sorted sizes, the last one is the highest
				let photo = message.photo[message.photo.length - 1]
				// Get the photo info form Telegram's
				let fileLink = await ctx.telegram.getFileLink(photo.file_id)
				let file = await downloadFile(fileLink.href)
				issue.photo = file

				ctx.session.issues.push(issue)

				ctx.scene.leave()
				ctx.reply(i18n.__('Prompts.Review.finish'), homeBtn())
			}
		}
	})

	bot.action(Actions.NEXT, async ctx => {
		await ctx.answerCbQuery()
		flow.stopFlow()
		ctx.session.issues.push(issue)
		ctx.scene.leave()
		ctx.reply(i18n.__('Prompts.Review.finish'), homeBtn())
	})
}
