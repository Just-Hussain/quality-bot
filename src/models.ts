import { v4 as uuid } from 'uuid'
import {
	Review as ReviewInterface,
	Response as ResponseInterface,
	Issue as IssueInterface,
	Ratings,
	ReviewQuestions,
} from './myContext'

export class Review implements ReviewInterface {
	id: string
	question: ReviewQuestions
	rating: Ratings
	comment?: string

	constructor(question: ReviewQuestions, rating: Ratings, comment?: string) {
		this.id = uuid()
		this.question = question
		this.rating = rating
		this.comment = comment
	}
}

export class Response implements ResponseInterface {
	id: string
	reviews: ReviewInterface[]

	constructor(reviews: ReviewInterface[] = []) {
		this.id = uuid()
		this.reviews = reviews
	}
}

export class Issue implements IssueInterface {
	id: string
	comment: string
	photo?: string

	constructor(comment: string, photo?: string) {
		this.id = uuid()
		this.comment = comment
		this.photo = photo
	}
}
