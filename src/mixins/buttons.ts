import i18n from 'i18n'
import { Markup } from 'telegraf'
import Actions from '../constants/actions'

export const nextBtn = () => {
	return Markup.inlineKeyboard([
		Markup.button.callback(i18n.__('Actions.next'), Actions.NEXT),
	])
}

export const homeBtn = () => {
	return Markup.inlineKeyboard([
		Markup.button.callback(i18n.__('Actions.home'), Actions.START),
	])
}
