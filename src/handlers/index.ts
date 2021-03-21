import { Telegraf, Scenes } from 'telegraf'
import { MyContext } from '../myContext'
import SceneIDs from '../constants/SceneIDs'
import general from './general'
import location from './location'
import issue from './issue'
import review from './review'
import reports from './reports'

const issueScene = new Scenes.BaseScene<MyContext>(SceneIDs.ISSUE)
const locationScene = new Scenes.BaseScene<MyContext>(SceneIDs.LOCATION)

export default (
	bot: Telegraf<MyContext>,
	stage: Scenes.Stage<MyContext>
): void => {
	stage.scenes = new Map<string, Scenes.BaseScene<MyContext>>([
		[SceneIDs.ISSUE, issueScene],
		[SceneIDs.LOCATION, locationScene],
	])

	general(bot)
	reports(bot)
	review(bot)
	issue(issueScene)
	location(locationScene)
}
