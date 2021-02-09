const fs = require('fs')

const toHyphenString = (str) => str.replace(/[\s\(\)]+/g, '-').toLowerCase()
function camelize(str) {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase()
		})
		.replace(/\s+/g, '')
}

const standardLanguages = [
	'common',
	'dwarvish',
	'elvish',
	'giant',
	'gnomish',
	'goblin',
	'halfling',
	'orc',
]

const races = JSON.parse(
	fs.readFileSync('./races_output.json', { encoding: 'utf-8' })
)
const output = races.map((r) => {
	const lowerCaseName = toHyphenString(r.name)
	const mapped = {
		id: r.name,
		name: r.name,
		category: 'race',
		code: `race:${lowerCaseName}`,
		features: [
			{
				name: '額外資料',
				code: `race:${lowerCaseName}:metadata`,
				mutations: [
					{
						key: 'metadata_race_name',
						formula: `"${r.name}"`,
					},
					{
						key: 'metadata_race_code',
						formula: `"race:${lowerCaseName}"`,
					},
				],
			},
		],
	}

	if (r.ability) {
		const ability = r.ability[0]
		const { choose, ...abilityOthers } = ability
		const toFullStatKey = (k) => {
			switch (k) {
				case 'str':
					return 'strength'
				case 'dex':
					return 'dexterity'
				case 'con':
					return 'constitution'
				case 'int':
					return 'intelligence'
				case 'wis':
					return 'wisdom'
				case 'cha':
					return 'charisma'
			}
			return k
		}
		const abilityMutations = Object.keys(abilityOthers).map((k) => ({
			key: `stat_${toFullStatKey(k)}_score`,
			formula: `+${ability[k]}`,
		}))

		mapped.features.push({
			name: '能力值',
			code: `race:${lowerCaseName}:stat`,
			isHidden: true,
			mutations: abilityMutations,
		})

		if (choose) {
			mapped.features.push({
				name: '能力值(自選)',
				code: `race:${lowerCaseName}:stat:choose`,
				isHidden: true,
				amount: choose.count,
				canRepeat: false,
				options: choose.from.map((k) => ({
					mutations: [
						{
							key: `stat_${toFullStatKey(k)}_score`,
							formula: `+${choose.value || 1}`,
						},
					],
				})),
			})
		}
	}

	if (r.speed) {
		mapped.features.push({
			name: '速度',
			code: `race:${lowerCaseName}:speed`,
			isHidden: true,
			mutations: [
				{
					key: 'speed_walking',
					formula: r.speed.toString(),
				},
			],
		})
	}

	if (r.size) {
		mapped.features.push({
			name: '體型',
			code: `race:${lowerCaseName}:size`,
			isHidden: true,
			mutations: [
				{
					key: 'size',
					formula: `"${r.size.toString()}"`,
				},
			],
		})
	}

	if (r.darkvision) {
		mapped.features.push({
			name: '黑暗視覺',
			code: `race:${lowerCaseName}:darkvision`,
			isHidden: true,
			mutations: [
				{
					key: 'sense_darkvision',
					formula: r.darkvision.toString(),
				},
			],
		})
	}

	for (const entry of r.entries) {
		const newFeature = {
			name: entry.name,
			code: `race:${lowerCaseName}:${toHyphenString(entry.name)}`,
			description: entry.entries
				.filter((e) => typeof e === 'string')
				.map((e) => e.toString())
				.join('. '),
		}

		mapped.features.push(newFeature)
	}

	if (r.languageProficiencies && r.languageProficiencies.length > 0) {
		const languageMutations = []
		const lm = r.languageProficiencies[0]
		for (const language in lm) {
			if (language === 'anyStandard') {
				const _standardLanguages = [...standardLanguages]
				for (const ol in lm) {
					const index = _standardLanguages.indexOf(ol)
					if (index !== -1) {
						_standardLanguages.splice(index, 1)
					}
				}

				mapped.features.push({
					name: '語言(自選)',
					code: `race:${lowerCaseName}:language:choose`,
					amount: lm[language],
					canRepeat: false,
					options: _standardLanguages.map((sl) => ({
						mutations: [
							{
								key: 'language',
								formula: `+"${sl}"`,
							},
						],
					})),
				})
			} else {
				languageMutations.push({
					key: 'language',
					formula: `+"${language}"`,
				})
			}
		}

		mapped.features.push({
			name: '語言',
			code: `race:${lowerCaseName}:language`,
			mutations: languageMutations,
		})
	}

	if (r.skillProficiencies) {
		const sp = r.skillProficiencies[0]
		const { choose, ...spOthers } = sp

		const skillMutations = Object.keys(spOthers).map((k) => ({
			key: `skill_${camelize(k)}_proficiencyRatio`,
			formula: `1`,
		}))

		mapped.features.push({
			name: '技能',
			code: `race:${lowerCaseName}:skill`,
			isHidden: true,
			mutations: skillMutations,
		})

		if (choose) {
			mapped.features.push({
				name: '技能(自選)',
				code: `race:${lowerCaseName}:skill:choose`,
				isHidden: true,
				amount: choose.count,
				canRepeat: false,
				options: choose.from.map((k) => ({
					mutations: [
						{
							key: `skill_${camelize(k)}_proficiencyRatio`,
							formula: `1`,
						},
					],
				})),
			})
		}
	}

	return mapped
})

fs.writeFileSync('./races_output2.json', JSON.stringify(output, null, 2))
