class RequestValidator {
	static validateTarget(state) {
		const stateInt = parseInt(state);
		if (isNaN(stateInt)) {
			return false;
		} else if (stateInt < 0 || stateInt > 100) {
			return false;
		} else {
			return true;
		}
	}

	static validateDebugState(state) {
		if (state === "open" || state === "closed") {
			return true;
		} else {
			return false;
		}
	}
}

module.exports = RequestValidator;