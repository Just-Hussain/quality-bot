import { Context } from 'telegraf'

export enum Rating {
	BAD = 1,
	GOOD,
	EXCELLENT,
}

export interface User {
	id: number
	is_bot: boolean
	first_name: string
	last_name: string
	username: string
	language_code: string
}

export interface Response {
	id: number
	rating: Rating
	comment?: string
}

export interface Issue {
	id: number
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
