import { Context, Scenes } from 'telegraf'

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
	id: number
	is_bot: boolean
	first_name: string
	last_name?: string
	username?: string
	language_code?: string
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

export interface Location {
	longitude: number
	latitude: number
	horizontal_accuracy?: number
	live_period?: number
	heading?: number
	proximity_alert_radius?: number
}

export interface Session extends Scenes.SceneSessionData {
	user: User
	location?: Location
	responses: Response[]
	issues: Issue[]
	__scenes: Scenes.SceneSessionData
}

export interface MyContext extends Context {
	session: Session
	scene: Scenes.SceneContextScene<MyContext>
}
