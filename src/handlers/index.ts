import { Telegraf, Scenes } from 'telegraf'
import { MyContext } from '../myContext'
import SceneIDs from '../constants/SceneIDs'
import general from './general'
import location from './location'
import issue from './issue'
import review from './review'
import reports from './reports'
import globalBot from './global'

const reviewScene = new Scenes.BaseScene<MyContext>(SceneIDs.REVIEW)
const issueScene = new Scenes.BaseScene<MyContext>(SceneIDs.ISSUE)
const locationScene = new Scenes.BaseScene<MyContext>(SceneIDs.LOCATION)

reviewScene.use(globalBot)
issueScene.use(globalBot)
locationScene.use(globalBot)

export default (
	bot: Telegraf<MyContext>,
	stage: Scenes.Stage<MyContext>
): void => {
	stage.scenes = new Map<string, Scenes.BaseScene<MyContext>>([
		[SceneIDs.REVIEW, reviewScene],
		[SceneIDs.ISSUE, issueScene],
		[SceneIDs.LOCATION, locationScene],
	])

	bot.use(globalBot)

	general(bot)
	reports(globalBot)
	review(reviewScene)
	issue(issueScene)
	location(locationScene)
}
