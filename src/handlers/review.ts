import i18n from 'i18n'
import { Telegraf, Context, Markup } from 'telegraf'
import { MyContext, ReviewQuestions } from '../myContext'
import Actions from '../constants/actions'

let commentRequested: boolean = false
let currentQuestion: ReviewQuestions = ReviewQuestions.TRACKING

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

		currentQuestion = ReviewQuestions.TRACKING
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
			case ReviewQuestions.TRACKING:
				currentQuestion = ReviewQuestions.LOCATION
				ctx.reply(i18n.__('Prompts.Review.location'), ratingBtns())
				break

			case ReviewQuestions.LOCATION:
				currentQuestion = ReviewQuestions.STATUS
				ctx.reply(i18n.__('Prompts.Review.status'), ratingBtns())
				break

			case ReviewQuestions.STATUS:
				currentQuestion = ReviewQuestions.PRICE
				ctx.reply(i18n.__('Prompts.Review.price'), ratingBtns())
				break

			case ReviewQuestions.PRICE:
				currentQuestion = ReviewQuestions.TRACKING
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
