import { Telegraf, Scenes } from 'telegraf'
import { MyContext } from '../myContext'
import general from './general'
import location from './location'
import issue from './issue'
import review from './review'

const issueScene = new Scenes.BaseScene<MyContext>('issue-scene')
const locationScene = new Scenes.BaseScene<MyContext>('location-scene')

export default (
	bot: Telegraf<MyContext>,
	stage: Scenes.Stage<MyContext>
): void => {
	stage.scenes = new Map<string, Scenes.BaseScene<MyContext>>([
		[issueScene.id, issueScene],
		[locationScene.id, locationScene],
	])

	general(bot)
	review(bot)
	issue(issueScene)
	location(locationScene)
}
