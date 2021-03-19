// The goal is to have a global indicator if the ongoing flow has been cancelled or not
// This prevents any unwanted actions
class Flow {
	private flow: boolean

	constructor() {
		this.flow = false
	}

	get isFlowing(): boolean {
		return this.flow
	}

	stopFlow() {
		this.flow = false
	}

	startFlow() {
		this.flow = true
	}
}

let flow: Flow = new Flow()

export default flow
