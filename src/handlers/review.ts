import i18n from 'i18n'
import { Telegraf, Markup } from 'telegraf'
import { MyContext, ReviewQuestions, Ratings } from '../myContext'
import { Review, Response } from '../models'
import Actions from '../constants/actions'

// A flag to check if the bot is accepting textual input or not
let commentRequested: boolean = false

// Keeps track of the flow of questions
let currentQuestion: ReviewQuestions = ReviewQuestions.TRACKING

// Keeps track of the selected rating
let rating: Ratings

// Keeps track of the provided comment, if any
let comment: string | undefined

// The response to be populated and stored
let response: Response

let ratingBtns = () => {
	return Markup.inlineKeyboard([
		Markup.button.callback(i18n.__('Actions.Ratings.bad'), Actions.RATING_BAD),
		Markup.button.callback(
			i18n.__('Actions.Ratings.good'),
			Actions.RATING_GOOD
		),
		Markup.button.callback(
			i18n.__('Actions.Ratings.excellent'),
			Actions.RATING_EXCELLENT
		),
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

export default (bot: Telegraf<MyContext>): void => {
	// The starting point of the reviewing flow
	bot.action(Actions.REVIEW_SERVICE, async ctx => {
		await ctx.answerCbQuery()

		response = new Response()
		currentQuestion = ReviewQuestions.TRACKING

		await ctx.reply(i18n.__('Prompts.reviewService'))
		ctx.reply(i18n.__('Prompts.Review.tracking'), ratingBtns())
	})

	// Stores the rating and prompts for the optional comment
	bot.action(
		[Actions.RATING_BAD, Actions.RATING_GOOD, Actions.RATING_EXCELLENT],
		async ctx => {
			await ctx.answerCbQuery()

			let action: string = (ctx.callbackQuery as any).data
			switch (action) {
				case Actions.RATING_BAD:
					rating = Ratings.BAD
					break

				case Actions.RATING_GOOD:
					rating = Ratings.GOOD
					break

				case Actions.RATING_EXCELLENT:
					rating = Ratings.EXCELLENT
					break
			}
			commentRequested = true
			await ctx.reply(i18n.__('Prompts.comment'), nextBtn())
		}
	)

	// Check if the bot is expecting the incoming message,
	// if yes, store it in its variable
	bot.on('message', ctx => {
		if (commentRequested) {
			comment = (ctx.message as any).text
			handleQuestionsFlow(ctx)
		}
	})

	// Handles displaying the next question after adding the current review to the response
	bot.action(Actions.NEXT, async ctx => {
		await ctx.answerCbQuery()

		handleQuestionsFlow(ctx)
	})
}

function handleQuestionsFlow(ctx: MyContext): void {
	switch (currentQuestion) {
		case ReviewQuestions.TRACKING:
			response.reviews.push(
				new Review(ReviewQuestions.TRACKING, rating, comment)
			)
			currentQuestion = ReviewQuestions.LOCATION
			ctx.reply(i18n.__('Prompts.Review.location'), ratingBtns())
			break

		case ReviewQuestions.LOCATION:
			response.reviews.push(
				new Review(ReviewQuestions.LOCATION, rating, comment)
			)
			currentQuestion = ReviewQuestions.STATUS
			ctx.reply(i18n.__('Prompts.Review.status'), ratingBtns())
			break

		case ReviewQuestions.STATUS:
			response.reviews.push(new Review(ReviewQuestions.STATUS, rating, comment))
			currentQuestion = ReviewQuestions.PRICE
			ctx.reply(i18n.__('Prompts.Review.price'), ratingBtns())
			break

		case ReviewQuestions.PRICE:
			response.reviews.push(new Review(ReviewQuestions.PRICE, rating, comment))

			// reset the questions flow
			currentQuestion = ReviewQuestions.TRACKING
			ctx.reply(i18n.__('Prompts.Review.finish'), homeBtn())
	}

	commentRequested = false
	comment = undefined
}
