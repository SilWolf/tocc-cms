const axios = require('axios')

const characters = [
	{ code: '00001-GT01', playerCode: '00001', cityCode: 'GT', name: '薰' },
	{ code: '00002-GT01', playerCode: '00002', cityCode: 'GT', name: '路蘭' },
	{ code: '00002-GT02', playerCode: '00002', cityCode: 'GT', name: '米拿度' },
	{ code: '00003-GT01', playerCode: '00003', cityCode: 'GT', name: '威爾斯' },
	{ code: '00004-GT01', playerCode: '00004', cityCode: 'GT', name: '邁諾斯' },
	{ code: '00004-GT02', playerCode: '00004', cityCode: 'GT', name: '羅德' },
	{ code: '00005-GT01', playerCode: '00005', cityCode: 'GT', name: 'Rodney' },
	{ code: '00006-GT01', playerCode: '00006', cityCode: 'GT', name: '路爾鹿坪' },
	{ code: '00006-GT02', playerCode: '00006', cityCode: 'GT', name: '花無缺' },
	{ code: '00007-JK02', playerCode: '00007', cityCode: 'JK', name: '笨' },
	{ code: '00007-GT01', playerCode: '00007', cityCode: 'GT', name: '笨' },
	{ code: '00008-GT01', playerCode: '00008', cityCode: 'GT', name: '艾莎絲' },
	{ code: '00008-GT03', playerCode: '00008', cityCode: 'GT', name: '妮婭' },
	{ code: '00008-GO02', playerCode: '00008', cityCode: 'GO', name: '笨' },
	{ code: '00009-GT01', playerCode: '00009', cityCode: 'GT', name: 'Gahara' },
	{ code: '00010-GT01', playerCode: '00010', cityCode: 'GT', name: 'Asivpa' },
	{ code: '00011-GT01', playerCode: '00011', cityCode: 'GT', name: '克伊' },
	{
		code: '00012-GT01',
		playerCode: '00012',
		cityCode: 'GT',
		name: '鐵查拉.黑',
	},
	{ code: '00013-GT01', playerCode: '00013', cityCode: 'GT', name: '道林' },
	{ code: '00014-GT01', playerCode: '00014', cityCode: 'GT', name: '阿倫' },
	{ code: '00015-GT01', playerCode: '00015', cityCode: 'GT', name: '阿爾薩斯' },
	{ code: '00016-JK03', playerCode: '00016', cityCode: 'JK', name: 'Abel' },
	{ code: '00016-GT02', playerCode: '00016', cityCode: 'GT', name: '阿爾薩斯' },
	{ code: '00016-GO01', playerCode: '00016', cityCode: 'GO', name: '阿爾薩斯' },
	{ code: '00017-JK02', playerCode: '00017', cityCode: 'JK', name: 'Reumirus' },
	{ code: '00017-GT01', playerCode: '00017', cityCode: 'GT', name: 'Reumirus' },
	{ code: '00018-GT01', playerCode: '00018', cityCode: 'GT', name: '艾爾文' },
	{ code: '00018-GT02', playerCode: '00018', cityCode: 'GT', name: '言鋒綺禮' },
	{ code: '00019-GT01', playerCode: '00019', cityCode: 'GT', name: 'Selina' },
	{ code: '00020-JK02', playerCode: '00020', cityCode: 'JK', name: 'Thrall' },
	{ code: '00020-GT01', playerCode: '00020', cityCode: 'GT', name: 'Selina' },
	{
		code: '00021-GT01',
		playerCode: '00021',
		cityCode: 'GT',
		name: '弗洛.雷米十一世',
	},
	{
		code: '00022-GT01',
		playerCode: '00022',
		cityCode: 'GT',
		name: '高爾。切特',
	},
	{ code: '00023-GT01', playerCode: '00023', cityCode: 'GT', name: '破浪' },
	{ code: '00023-GT02', playerCode: '00023', cityCode: 'GT', name: 'Yuki' },
	{ code: '00024-JK02', playerCode: '00024', cityCode: 'JK', name: 'Sue' },
	{ code: '00024-GT01', playerCode: '00024', cityCode: 'GT', name: 'Sue' },
	{ code: '00024-GO03', playerCode: '00024', cityCode: 'GO', name: 'Yuki' },
	{ code: '00025-GO01', playerCode: '00025', cityCode: 'GO', name: 'Charlie' },
	{ code: '00025-GO02', playerCode: '00025', cityCode: 'GO', name: 'Carry' },
	{ code: '00025-GO03', playerCode: '00025', cityCode: 'GO', name: '白素' },
	{ code: '00026-GO01', playerCode: '00026', cityCode: 'GO', name: '艾力克' },
	{ code: '00026-GO02', playerCode: '00026', cityCode: 'GO', name: '天秤' },
	{
		code: '00027-GO01',
		playerCode: '00027',
		cityCode: 'GO',
		name: 'Rii-Kogaan',
	},
	{ code: '00027-GO02', playerCode: '00027', cityCode: 'GO', name: '拉赫哈爾' },
	{ code: '00027-GO03', playerCode: '00027', cityCode: 'GO', name: '迪克森' },
	{ code: '00028-GO01', playerCode: '00028', cityCode: 'GO', name: '蕾莎' },
	{ code: '00029-GO01', playerCode: '00029', cityCode: 'GO', name: '人魚公主' },
	{
		code: '00029-GO02',
		playerCode: '00029',
		cityCode: 'GO',
		name: 'Freyja 芙蕾亞',
	},
	{
		code: '00030-GO01',
		playerCode: '00030',
		cityCode: 'GO',
		name: '史提芬。烈風',
	},
	{ code: '00030-GO02', playerCode: '00030', cityCode: 'GO', name: '尼奧爾' },
	{ code: '00031-GO01', playerCode: '00031', cityCode: 'GO', name: '白崎深雪' },
	{ code: '00031-GO02', playerCode: '00031', cityCode: 'GO', name: '菲比奧  ' },
	{ code: '00032-GO01', playerCode: '00032', cityCode: 'GO', name: '星光' },
	{ code: '00033-GO01', playerCode: '00033', cityCode: 'GO', name: 'Alex' },
	{ code: '00035-GO01', playerCode: '00035', cityCode: 'GO', name: '追風' },
	{ code: '00035-GO02', playerCode: '00035', cityCode: 'GO', name: 'Zayer' },
	{ code: '00036-GO01', playerCode: '00036', cityCode: 'GO', name: '米法' },
	{ code: '00036-GO02', playerCode: '00036', cityCode: 'GO', name: 'Ruby' },
	{ code: '00037-GO01', playerCode: '00037', cityCode: 'GO', name: '索柏' },
	{ code: '00038-GO01', playerCode: '00038', cityCode: 'GO', name: 'Solar' },
	{ code: '00039-GO01', playerCode: '00039', cityCode: 'GO', name: '萊亞' },
	{ code: '00040-GO01', playerCode: '00040', cityCode: 'GO', name: 'Meham' },
	{
		code: '00041-GO01',
		playerCode: '00041',
		cityCode: 'GO',
		name: '阿爾加.辛格特',
	},
	{ code: '00042-GO01', playerCode: '00042', cityCode: 'GO', name: '風早結弦' },
	{
		code: '00042-GO02',
		playerCode: '00042',
		cityCode: 'GO',
		name: '緹雅(Thia)',
	},
	{ code: '00042-GO03', playerCode: '00042', cityCode: 'GO', name: '月影' },
	{ code: '00043-GO01', playerCode: '00043', cityCode: 'GO', name: 'JOE' },
	{
		code: '00044-GO01',
		playerCode: '00044',
		cityCode: 'GO',
		name: '艾爾丁．格蘭奈漢',
	},
	{ code: '00045-GO01', playerCode: '00045', cityCode: 'GO', name: '瓜密哈' },
	{ code: '00046-GO01', playerCode: '00046', cityCode: 'GO', name: '圖林' },
	{
		code: '00047-GO01',
		playerCode: '00047',
		cityCode: 'GO',
		name: '史提芬．蘭',
	},
	{
		code: '00048-JK01',
		playerCode: '00048',
		cityCode: 'JK',
		name: '歐以力．法蘭克',
	},
	{ code: '00049-JK01', playerCode: '00049', cityCode: 'JK', name: '麥斯武' },
	{ code: '00050-JK01', playerCode: '00050', cityCode: 'JK', name: '皮爾修' },
	{ code: '00051-JK01', playerCode: '00051', cityCode: 'JK', name: '古蘭' },
	{ code: '00052-JK01', playerCode: '00052', cityCode: 'JK', name: '米婭' },
	{ code: '00053-JK01', playerCode: '00053', cityCode: 'JK', name: 'Zelda' },
	{
		code: '00054-JK01',
		playerCode: '00054',
		cityCode: 'JK',
		name: '希里．文里亞',
	},
]

;(async () => {
	const players = await axios
		.get(`http://localhost:1337/users`)
		.then((res) => res.data)
	const cities = await axios
		.get(`http://localhost:1337/cities`)
		.then((res) => res.data)

	for (let character of characters) {
		const player = players.find((_) => _.code === character.playerCode)
		const city = cities.find((_) => _.code === character.cityCode)

		try {
			await axios.post(`http://localhost:1337/characters`, {
				name: character.name,
				code: character.code,
				player: player?.id,
				city: city?.id,
				type: 'PC',
			})
			console.log(`${character.code} DONE`)
		} catch (err) {
			console.error(`${character.code} ERROR`, err)
		}
	}
})()
