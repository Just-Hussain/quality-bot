import { Telegraf } from 'telegraf'
import { MyContext } from '../myContext'
import i18n from 'i18n'
import Commands from '../constants/commands'

export default (bot: Telegraf<MyContext>) => {
	bot.command(Commands.REPORTS, async ctx => {
		let reply = `${i18n.__('Prompts.Review.header')}:\n`
		ctx.session.responses.forEach(response => {
			let msg = `
			${i18n.__('Prompts.Review.tracking')}: ${response.reviews[0].rating}/3
			${i18n.__('comment')}: ${response.reviews[0].comment || i18n.__('none')}

			${i18n.__('Prompts.Review.location')}: ${response.reviews[1].rating}/3
			${i18n.__('comment')}: ${response.reviews[1].comment || i18n.__('none')}

			${i18n.__('Prompts.Review.status')}: ${response.reviews[2].rating}/3
			${i18n.__('comment')}: ${response.reviews[2].comment || i18n.__('none')}

			${i18n.__('Prompts.Review.price')}: ${response.reviews[3].rating}/3
			${i18n.__('comment')}: ${response.reviews[3].comment || i18n.__('none')}

			_____________

			`
			reply += msg
		})

		ctx.reply(reply)
	})

	bot.command(Commands.ISSUES, async ctx => {
		await ctx.reply(i18n.__('Prompts.Issue.header'))
		ctx.session.issues.forEach(async issue => {
			if (issue.photo) {
				await ctx.replyWithPhoto(
					{ source: `images/${issue.photo}` },
					{
						caption: `
					${i18n.__('comment')}:
					${issue.comment}
					`,
					}
				)
			} else {
				await ctx.reply(`
					${i18n.__('comment')}:
					${issue.comment}

					${i18n.__('Prompts.Issue.noPhoto')}
				`)
			}
		})
	})

	bot.command(Commands.LOCATION, async ctx => {
		let location = ctx.session.location
		if (location) {
			await ctx.reply(i18n.__('Prompts.headerLocation'))
			await ctx.replyWithLocation(location.latitude, location.longitude, {
				...location,
			})
		} else {
			ctx.reply(i18n.__('Prompts.noLocation'))
		}
	})
}
