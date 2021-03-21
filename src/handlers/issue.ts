import i18n from 'i18n'
import { Scenes } from 'telegraf'
import { homeBtn, nextBtn } from '../mixins/buttons'
import { MyContext } from '../myContext'
import { Issue } from '../models'
import { downloadFile } from '../utils'
import flow from './flow'
import Actions from '../constants/actions'

let commentRequested: boolean = false
let photoRequested: boolean = false
let comment: string | undefined
let issue: Issue = new Issue('')

export default (bot: Scenes.BaseScene<MyContext>): void => {
	// scene entered, set it up
	bot.enter(async ctx => {
		await ctx.answerCbQuery()
		flow.startFlow()

		comment = undefined
		commentRequested = true
		issue = new Issue('')

		await ctx.reply(i18n.__('Prompts.reportIssue'))
		await ctx.reply(i18n.__('Prompts.Issue.comment'))
	})

	// got issue description, store it and ask for photo
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

	// got photo of issue
	// download it, and locally save the issue object
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
		if (!ctx.session.issues) ctx.session.issues = []
		ctx.session.issues.push(issue)
		ctx.scene.leave()
		ctx.reply(i18n.__('Prompts.Review.finish'), homeBtn())
	})
}
