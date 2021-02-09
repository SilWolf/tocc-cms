const fs = require('fs')

const races = JSON.parse(fs.readFileSync('./races.json', { encoding: 'utf-8' }))
	.race
const output = races.filter((r) => r.source === 'PHB')

fs.writeFileSync('./races_output.json', JSON.stringify(output, null, 2))
