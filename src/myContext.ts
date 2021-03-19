import { Context } from 'telegraf'

export enum Ratings {
	BAD = 1,
	GOOD,
	EXCELLENT,
}

export enum ReviewQuestions {
	TRACKING = 'Quality of shipment tracking.',
	LOCATION = 'Precision of delivery location',
	STATUS = 'Physical Status of product',
	PRICE = 'Price of product',
}

export interface User {
	id: string
	is_bot: boolean
	first_name: string
	last_name: string
	username: string
	language_code: string
}

export interface Review {
	id: string
	question: ReviewQuestions
	rating: Ratings
	comment?: string
}

export interface Response {
	id: string
	reviews: Array<Review>
}

export interface Issue {
	id: string
	comment: string
	photo?: string
}

export interface Session {
	user: User
	location: string
	responses: Response[]
	issues: Issue[]
}

export interface MyContext extends Context {
	session: Session
}
