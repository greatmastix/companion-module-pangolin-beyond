const { Regex } = require('@companion-module/base')

function integerOption(id, label, defaultValue, options = {}) {
	return {
		type: 'textinput',
		id,
		label,
		default: String(defaultValue),
		regex: options.regex ?? Regex.SIGNED_NUMBER,
		useVariables: true,
		tooltip: options.tooltip,
		minValue: options.minValue,
		maxValue: options.maxValue,
		valueType: 'integer',
	}
}

function floatOption(id, label, defaultValue, options = {}) {
	return {
		type: 'textinput',
		id,
		label,
		default: String(defaultValue),
		regex: options.regex ?? Regex.SIGNED_FLOAT,
		useVariables: true,
		tooltip: options.tooltip,
		minValue: options.minValue,
		maxValue: options.maxValue,
		valueType: 'float',
	}
}

function textOption(id, label, defaultValue, options = {}) {
	return {
		type: 'textinput',
		id,
		label,
		default: String(defaultValue),
		useVariables: true,
		regex: options.regex,
		tooltip: options.tooltip,
		valueType: 'string',
	}
}

function dropdownOption(id, label, choices, defaultValue, options = {}) {
	return {
		type: 'dropdown',
		id,
		label,
		choices,
		default: defaultValue,
		tooltip: options.tooltip,
	}
}

function triggerCommand(id, name, path) {
	return {
		id,
		name,
		options: [],
		buildMessages: () => [{ path, value: 1 }],
	}
}

function parseCustomArguments(input) {
	const text = String(input ?? '').trim()
	if (!text) {
		return []
	}

	const normalized = text.replaceAll(/[\u201c\u201d\u201e\u201f]/g, '"').replaceAll(/[\u2018\u2019\u201a\u201b]/g, "'")
	const regex = /[+-]?(?:\d*\.\d+|\d+\.\d*|\d+)|"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|(\S+)/g
	const args = []

	for (const match of normalized.matchAll(regex)) {
		const token = match[0]

		if (match[1] !== undefined) {
			args.push({ type: 's', value: match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\') })
		} else if (match[2] !== undefined) {
			args.push({ type: 's', value: match[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\') })
		} else if (/^[+-]?\d+$/.test(token)) {
			args.push({ type: 'i', value: Number.parseInt(token, 10) })
		} else if (/^[+-]?(?:\d*\.\d+|\d+\.\d*)$/.test(token)) {
			args.push({ type: 'f', value: Number.parseFloat(token) })
		} else if (match[3] !== undefined) {
			args.push({ type: 's', value: match[3] })
		}
	}

	return args
}

const LIVE_CONTROL_SCALAR_PARAMETERS = [
	{ id: 'size', label: 'size (-400..400, all axes)' },
	{ id: 'sizex', label: 'sizex (-400..400)' },
	{ id: 'sizey', label: 'sizey (-400..400)' },
	{ id: 'sizez', label: 'sizez (-400..400)' },
	{ id: 'zoom', label: 'zoom (0..100)' },
	{ id: 'posx', label: 'posx (-32768..32768)' },
	{ id: 'posy', label: 'posy (-32768..32768)' },
	{ id: 'posz', label: 'posz (-32768..32768)' },
	{ id: 'anglex', label: 'anglex (-2880..2880)' },
	{ id: 'angley', label: 'angley (-2880..2880)' },
	{ id: 'anglez', label: 'anglez (-2880..2880)' },
	{ id: 'rotox', label: 'rotox (-1440..1440)' },
	{ id: 'rotoy', label: 'rotoy (-1440..1440)' },
	{ id: 'rotoz', label: 'rotoz (-1440..1440)' },
	{ id: 'brightness', label: 'brightness (0..100)' },
	{ id: 'visiblepoints', label: 'visiblepoints (0..100)' },
	{ id: 'colorslider', label: 'colorslider (0..255)' },
	{ id: 'anispeed', label: 'anispeed (0..400)' },
	{ id: 'scanrate', label: 'scanrate (10..200)' },
	{ id: 'red', label: 'red (0..255)' },
	{ id: 'green', label: 'green (0..255)' },
	{ id: 'blue', label: 'blue (0..255)' },
	{ id: 'alpha', label: 'alpha (0..255)' },
	{ id: 'fx1', label: 'fx1 (-1..47)' },
	{ id: 'fx2', label: 'fx2 (-1..47)' },
	{ id: 'fx3', label: 'fx3 (-1..47)' },
	{ id: 'fx4', label: 'fx4 (-1..47)' },
	{ id: 'fx1action', label: 'fx1action (0..100)' },
	{ id: 'fx2action', label: 'fx2action (0..100)' },
	{ id: 'fx3action', label: 'fx3action (0..100)' },
	{ id: 'fx4action', label: 'fx4action (0..100)' },
]

const LIVE_CONTROL_PAIR_PARAMETERS = [
	{ id: 'size', label: 'size (x, y)' },
	{ id: 'pos', label: 'pos (x, y)' },
]

function createFloatArg(value) {
	return {
		type: 'f',
		value,
	}
}

const LIVE_CONTROL_COMMANDS = [
	{
		id: 'livecontrol_scalar',
		name: 'Live Control parameter',
		options: [
			dropdownOption(
				'parameter',
				'Parameter',
				LIVE_CONTROL_SCALAR_PARAMETERS.map((parameter) => ({
					id: parameter.id,
					label: parameter.label,
				})),
				'brightness',
				{
					tooltip: 'Sets one of the Pangolin Beyond master live control parameters that takes a single float value.',
				},
			),
			floatOption('value', 'Value', 0, {
				tooltip: 'Accepts variables and sends the value as an OSC float.',
			}),
		],
		buildMessages: (options) => [
			{
				path: `/beyond/master/livecontrol/${options.parameter}`,
				type: 'f',
				value: options.value,
			},
		],
	},
	{
		id: 'livecontrol_pair',
		name: 'Live Control parameter (2 values)',
		options: [
			dropdownOption(
				'parameter',
				'Parameter',
				LIVE_CONTROL_PAIR_PARAMETERS.map((parameter) => ({
					id: parameter.id,
					label: parameter.label,
				})),
				'size',
				{
					tooltip: 'Sets one of the Pangolin Beyond master live control parameters that takes two float values.',
				},
			),
			floatOption('value_1', 'Value 1', 0),
			floatOption('value_2', 'Value 2', 0),
		],
		buildMessages: (options) => [
			{
				path: `/beyond/master/livecontrol/${options.parameter}`,
				args: [createFloatArg(options.value_1), createFloatArg(options.value_2)],
			},
		],
	},
	{
		id: 'custom_osc',
		name: 'Custom OSC command',
		options: [
			textOption('path', 'OSC address', '/beyond/master/livecontrol/brightness', {
				regex: Regex.SOMETHING,
				tooltip: 'Paste the OSC address to send to BEYOND.',
			}),
			textOption('arguments', 'Arguments', '', {
				tooltip:
					'Optional. Use space-separated values. Integers are sent as i, decimals as f, and text as s. Quote strings with spaces.',
			}),
		],
		buildMessages: (options) => {
			const path = String(options.path).trim()
			if (!path) {
				throw new Error('OSC address is required')
			}

			return [
				{
					path,
					args: parseCustomArguments(options.arguments),
				},
			]
		},
	},
]

module.exports = [
	{
		id: 'Brightness',
		name: 'Brightness',
		options: [integerOption('brightness_value', 'Brightness', 100)],
		buildMessages: (options) => [
			{
				path: '/beyond/master/brightness',
				value: options.brightness_value,
			},
		],
	},
	{
		id: 'selectclip',
		name: 'Select clip',
		options: [integerOption('page_value', 'Page', 1), integerOption('cell_value', 'Cell', 1)],
		buildMessages: (options) => [
			{
				path: '/b/Grid/PageIndex',
				value: options.page_value,
			},
			{
				path: '/b/Grid/CellIndex',
				value: options.cell_value,
			},
		],
	},
	{
		id: 'startclip',
		name: 'Start clip',
		options: [
			{
				type: 'checkbox',
				id: 'use_specific_clip',
				label: 'Start a specific clip',
				default: false,
			},
			{
				...integerOption('page_value', 'Page', 1, {
					minValue: 1,
					tooltip: 'Page number to focus before starting the clip.',
				}),
				isVisible: (options) => options.use_specific_clip === true,
				isVisibleExpression: '$(options:use_specific_clip) === true',
			},
			{
				...integerOption('cell_value', 'Cell', 1, {
					minValue: 1,
					tooltip: 'Cell number to focus before starting the clip.',
				}),
				isVisible: (options) => options.use_specific_clip === true,
				isVisibleExpression: '$(options:use_specific_clip) === true',
			},
		],
		buildMessages: (options) => {
			if (options.use_specific_clip) {
				return [
					{
						path: '/beyond/general/FocusCell',
						args: [
							{ type: 'i', value: options.page_value },
							{ type: 'i', value: options.cell_value },
						],
					},
					{
						path: '/beyond/general/StartCell',
						value: 1,
					},
				]
			}

			return [
				{
					path: '/beyond/general/StartCell',
					value: 1,
				},
			]
		},
	},
	{
		id: 'bpm',
		name: 'BPM',
		options: [integerOption('bpm_value', 'BPM', 60)],
		buildMessages: (options) => [
			{
				path: '/b/master/bpm',
				value: options.bpm_value,
			},
		],
	},
	{
		id: 'selectfxslot',
		name: 'Select FX slot',
		options: [
			integerOption('fx_layer', 'Effect layer', 1, {
				regex: Regex.NUMBER,
				minValue: 1,
				maxValue: 4,
				tooltip: 'Choose the FX layer number from 1 to 4.',
			}),
			integerOption('fx_slot', 'Effect slot', 0, {
				minValue: -1,
				maxValue: 47,
				tooltip: 'Use -1 to stop the current effect, or 0 to 47 to select a slot in the active FX row.',
			}),
		],
		buildMessages: (options) => [
			{
				path: `/beyond/master/livecontrol/fx${options.fx_layer}`,
				type: 'f',
				value: options.fx_slot,
			},
		],
	},
	triggerCommand('bpmtap', 'BPM Tap', '/beyond/general/BeatTap'),
	triggerCommand('laserenable', 'Enable Output', '/beyond/general/enablelaseroutput'),
	triggerCommand('laserdisable', 'Disable Output', '/beyond/general/disablelaseroutput'),
	triggerCommand('Blackout', 'Blackout', '/beyond/general/blackout'),
	triggerCommand('onecue', 'One cue', '/beyond/general/onecue'),
	triggerCommand('multicue', 'Multi cue', '/beyond/general/multicue'),
	triggerCommand('select', 'Click select', '/beyond/general/clickselect'),
	triggerCommand('toggle', 'Toggle', '/beyond/general/clicktoggle'),
	triggerCommand('restart', 'Restart', '/beyond/general/clickrestart'),
	triggerCommand('flash', 'Flash', '/beyond/general/clickflash'),
	triggerCommand('soloflash', 'Solo flash', '/beyond/general/clicksoloflash'),
	...LIVE_CONTROL_COMMANDS,
]
