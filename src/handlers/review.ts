import i18n from 'i18n'
import { Telegraf, Context, Markup } from 'telegraf'
import { MyContext } from '../myContext'
import Actions from '../constants/actions'

enum Questions {
	TRACKING,
	LOCATION,
	STATUS,
	PRICE,
}
let commentRequested: boolean = false
let currentQuestion: Questions = Questions.TRACKING

export default (bot: Telegraf<MyContext>): void => {
	let ratingBtns = () => {
		return Markup.inlineKeyboard([
			Markup.button.callback(i18n.__('Actions.Ratings.bad'), Actions.RATING),
			Markup.button.callback(i18n.__('Actions.Ratings.good'), Actions.RATING),
			Markup.button.callback(
				i18n.__('Actions.Ratings.excellent'),
				Actions.RATING
			),
		])
	}
	let nextBtn = () => {
		return Markup.inlineKeyboard([
			Markup.button.callback(i18n.__('Actions.next'), Actions.NEXT),
		])
	}

	bot.action(Actions.REVIEW_SERVICE, async ctx => {
		await ctx.answerCbQuery()

		currentQuestion = Questions.TRACKING
		await ctx.reply(i18n.__('Prompts.reviewService'))
		ctx.reply(i18n.__('Prompts.Review.tracking'), ratingBtns())
	})

	bot.action(Actions.RATING, async ctx => {
		await ctx.answerCbQuery()

		commentRequested = true
		await ctx.reply(i18n.__('Prompts.comment'), nextBtn())
	})

	bot.action(Actions.NEXT, async ctx => {
		await ctx.answerCbQuery()

		commentRequested = false
		switch (currentQuestion) {
			case Questions.TRACKING:
				currentQuestion++
				ctx.reply(i18n.__('Prompts.Review.location'), ratingBtns())
				break

			case Questions.LOCATION:
				currentQuestion++
				ctx.reply(i18n.__('Prompts.Review.status'), ratingBtns())
				break

			case Questions.STATUS:
				currentQuestion++
				ctx.reply(i18n.__('Prompts.Review.price'), ratingBtns())
				break

			case Questions.PRICE:
				currentQuestion = Questions.TRACKING
				ctx.reply('bruh, uve finished')

			default:
				break
		}
	})

	bot.on('message', ctx => {
		if (commentRequested) {
			console.log((ctx.message as any).text)
		}
	})
}
