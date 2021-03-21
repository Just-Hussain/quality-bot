import { Telegraf } from 'telegraf'
import { MyContext } from '../myContext'
import Actions from '../constants/actions'
import SceneIDs from '../constants/SceneIDs'

export default (bot: Telegraf<MyContext>): void => {
	bot.action(Actions.REVIEW_SERVICE, ctx => ctx.scene.enter(SceneIDs.REVIEW))
	bot.action(Actions.REPORT_ISSUE, ctx => ctx.scene.enter(SceneIDs.ISSUE))
	bot.action(Actions.SHARE_LOCATION, ctx => ctx.scene.enter(SceneIDs.LOCATION))
}
