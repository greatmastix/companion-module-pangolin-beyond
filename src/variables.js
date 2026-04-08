module.exports = function (self) {
	self.setVariableDefinitions([
		{ variableId: 'target_host', name: 'Configured target host' },
		{ variableId: 'target_port', name: 'Configured target port' },
		{ variableId: 'last_action', name: 'Last action sent' },
		{ variableId: 'last_sent_summary', name: 'Last OSC messages sent' },
		{ variableId: 'last_sent_at', name: 'Last command timestamp (ISO-8601)' },
		{ variableId: 'last_message_count', name: 'Last OSC message count' },
	])
}
