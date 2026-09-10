const COMMANDS = require('./commands')

async function resolveOptions(self, optionDefinitions, inputOptions) {
	const resolvedOptions = {}

	for (const option of optionDefinitions) {
		if (!option.id) continue

		const rawValue = inputOptions?.[option.id]
		if (option.useVariables) {
			resolvedOptions[option.id] = await self.parseVariablesInString(String(rawValue ?? ''))
		} else {
			resolvedOptions[option.id] = rawValue
		}
	}

	return resolvedOptions
}

function toInteger(value, label) {
	const parsed = Number.parseInt(String(value).trim(), 10)
	if (!Number.isInteger(parsed)) {
		throw new Error(`${label} must resolve to an integer`)
	}

	return parsed
}

function toFloat(value, label) {
	const parsed = Number.parseFloat(String(value).trim())
	if (!Number.isFinite(parsed)) {
		throw new Error(`${label} must resolve to a number`)
	}

	return parsed
}

function normalizeOptions(command) {
	return (resolvedOptions) => {
		const normalizedOptions = {}

		for (const option of command.options) {
			if (!option.id) continue

			if (option.valueType === 'integer') {
				const parsedValue = toInteger(resolvedOptions[option.id], option.label)
				if (option.minValue !== undefined && parsedValue < option.minValue) {
					throw new Error(`${option.label} must be at least ${option.minValue}`)
				}
				if (option.maxValue !== undefined && parsedValue > option.maxValue) {
					throw new Error(`${option.label} must be at most ${option.maxValue}`)
				}

				normalizedOptions[option.id] = parsedValue
			} else if (option.valueType === 'float') {
				const parsedValue = toFloat(resolvedOptions[option.id], option.label)
				if (option.minValue !== undefined && parsedValue < option.minValue) {
					throw new Error(`${option.label} must be at least ${option.minValue}`)
				}
				if (option.maxValue !== undefined && parsedValue > option.maxValue) {
					throw new Error(`${option.label} must be at most ${option.maxValue}`)
				}

				normalizedOptions[option.id] = parsedValue
			} else {
				normalizedOptions[option.id] = resolvedOptions[option.id]
			}
		}

		return normalizedOptions
	}
}

module.exports = function (self) {
	const actionDefinitions = {}

	for (const command of COMMANDS) {
		actionDefinitions[command.id] = {
			name: command.name,
			options: command.options,
			callback: async (event) => {
				try {
					const resolvedOptions = await resolveOptions(self, command.options, event.options)
					const normalizedOptions = normalizeOptions(command)(resolvedOptions)
					const messages = command.buildMessages(normalizedOptions)
					self.sendCommandBatch(command.id, messages)
				} catch (error) {
					self.log('error', `Unable to send "${command.name}": ${error.message}`)
				}
			},
		}
	}

	self.setActionDefinitions(actionDefinitions)
}
