const fs = require('fs')
const axios = require('axios')

const instance = axios.create({
	baseURL: 'http://localhost:1337',
	timeout: 60000,
})

const races = JSON.parse(
	fs.readFileSync('./races_output2.json', { encoding: 'utf-8' })
)

;(async () => {
	for (const race of races) {
		const createdRace = await instance
			.post('/races', {
				name: race.name,
				code: race.code,
			})
			.then((res) => res.data)

		console.log(`race ${createdRace.name} DONE`)

		const createdAttachable = await instance
			.post('/attachables', {
				name: race.name,
				category: 'race',
				code: race.code,
				features: race.features,
				race: createdRace.id,
			})
			.then((res) => res.data)

		console.log(`attachable ${createdAttachable.id} DONE`)
	}
})()
