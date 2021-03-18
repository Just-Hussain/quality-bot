import { Telegraf } from 'telegraf'

import general from './general'
import location from './location'
import issue from './issue'
import review from './review'

export default (bot: Telegraf): void => {
	general(bot)
	location(bot)
	issue(bot)
	review(bot)
}
