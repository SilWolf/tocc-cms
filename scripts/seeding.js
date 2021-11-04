const axios = require("axios").default;

(async () => {
  const api = axios.create({
    baseURL: "http://localhost:1337",
  });
  api.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.log(error);
      throw error;
    }
  );

  // Login bot

  const bot = await api.post("/auth/local", {
    identifier: "TOCC-BOT",
    password: "tocc-bot@tocc.io",
  });

  api.defaults.headers.common["Authorization"] = `Bearer ${bot.jwt}`;

  const createIfNotExist = async (model, payload, query) => {
    const item = await api
      .get(`/${model}`, { params: query })
      .then((items) => items?.[0]);
    if (item) {
      const key = Object.values(query)[0];
      console.log(`fetched ${model} ${key}`);
      return item;
    }

    return api.post(`/${model}`, payload).then((result) => {
      const key = Object.values(query)[0];
      console.log(`create ${model} ${key} DONE`);

      return result;
    });
  };

  const [DND5E] = await Promise.all(
    [
      {
        name: "龍與地下城(五版)",
        nameEn: "Dungeon and Dragon (5th Edition)",
        code: "ruleset:DND5E",
      },
    ].map((payload) =>
      createIfNotExist("rulesets", payload, { code: payload.code })
    )
  );

  const [PHB, DBM, MM, XGE, SCAG, TOCC] = await Promise.all(
    [
      {
        name: "玩家手冊",
        nameEn: "Player's Handbook",
        code: "rulebook:PHB",
        ruleset: DND5E.id,
      },
      {
        name: "城主指南",
        nameEn: "Dungeon Master Guide",
        code: "rulebook:DMG",
        ruleset: DND5E.id,
      },
      {
        name: "怪物書",
        nameEn: "Monster Manual",
        code: "rulebook:MM",
        ruleset: DND5E.id,
      },
      {
        name: "珊薩娜的萬事指南",
        nameEn: "Xanathar's Guide to Everything",
        code: "rulebook:XGE",
        ruleset: DND5E.id,
      },
      {
        name: "劍灣冒險者指南",
        nameEn: "Sword Coast Adventurer's Guide",
        code: "rulebook:SCAG",
        ruleset: DND5E.id,
      },
      {
        name: "海城扎記自訂規則",
        nameEn: "Tales of Coastal Cities Homebrew",
        code: "rulebook:TOCC",
        ruleset: DND5E.id,
      },
    ].map((payload) =>
      createIfNotExist("rulebooks", payload, { code: payload.code })
    )
  );

  const [
    parentHuman,
    parentElf,
    parentDwarf,
    parentDragonborn,
    parentHalfling,
    parentGnome,
  ] = await Promise.all(
    [
      {
        name: "人類",
        nameEn: "Human",
        code: "parentRace:human",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "精靈",
        nameEn: "Elf",
        code: "parentRace:elf",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "矮人",
        nameEn: "Dwarf",
        code: "parentRace:dwarf",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "龍裔",
        nameEn: "Dragonborn",
        code: "parentRace:dragonborn",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "半身人",
        nameEn: "Halfling",
        code: "parentRace:halfling",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "侏儒",
        nameEn: "Gnome",
        code: "parentRace:gnome",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
    ]
      .map((payload) => ({
        ...payload,
        isParentRace: true,
      }))
      .map((payload) =>
        createIfNotExist("races", payload, { code: payload.code })
      )
  );

  const races = await Promise.all(
    [
      {
        name: "人類",
        nameEn: "Human",
        code: "race:human",
        parentRace: parentHuman.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "變種人類",
        nameEn: "Variant Human",
        code: "race:variant-human",
        parentRace: parentHuman.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "木精靈",
        nameEn: "Wood Elf",
        code: "race:wood-elf",
        parentRace: parentElf.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "卓爾精靈",
        nameEn: "Drow",
        code: "race:drow",
        parentRace: parentElf.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "高等精靈",
        nameEn: "High Elf",
        code: "race:high-elf",
        parentRace: parentElf.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "山地矮人",
        nameEn: "Mountain Dwarf",
        code: "race:mountain-dwarf",
        parentRace: parentDwarf.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "丘陵矮人",
        nameEn: "Hill Dwarf",
        code: "race:hill-dwarf",
        parentRace: parentDwarf.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "半精靈",
        nameEn: "Half-elf",
        code: "race:half-elf",
      },
      {
        name: "半獸人",
        nameEn: "Half-orc",
        code: "race:half-orc",
      },
      {
        name: "黑龍裔",
        nameEn: "Black Dragonborn",
        code: "race:black-dragonborn",
        parentRace: parentDragonborn.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "藍龍裔",
        nameEn: "Blue Dragonborn",
        code: "race:blue-dragonborn",
        parentRace: parentDragonborn.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "黃銅龍裔",
        nameEn: "Brass Dragonborn",
        code: "race:brass-dragonborn",
        parentRace: parentDragonborn.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "青銅龍裔",
        nameEn: "Bronze Dragonborn",
        code: "race:bronze-dragonborn",
        parentRace: parentDragonborn.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "赤銅龍裔",
        nameEn: "Copper Dragonborn",
        code: "race:copper-dragonborn",
        parentRace: parentDragonborn.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "金龍裔",
        nameEn: "Gold Dragonborn",
        code: "race:gold-dragonborn",
        parentRace: parentDragonborn.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "綠龍裔",
        nameEn: "Green Dragonborn",
        code: "race:green-dragonborn",
        parentRace: parentDragonborn.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "紅龍裔",
        nameEn: "Red Dragonborn",
        code: "race:red-dragonborn",
        parentRace: parentDragonborn.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "銀龍裔",
        nameEn: "Silver Dragonborn",
        code: "race:silver-dragonborn",
        parentRace: parentDragonborn.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "白龍裔",
        nameEn: "White Dragonborn",
        code: "race:white-dragonborn",
        parentRace: parentDragonborn.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "輕足半身人",
        nameEn: "Lightfoot Halfling",
        code: "race:lightfoot-halfling",
        parentRace: parentHalfling.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "強魄半身人",
        nameEn: "Stout Halfling",
        code: "race:stout-halfling",
        parentRace: parentHalfling.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "提夫林",
        nameEn: "Tiefling",
        code: "race:tiefling",
        mainRaceCode: "mainRace:tiefling",
      },
      {
        name: "岩侏儒",
        nameEn: "Rock Gnome",
        code: "race:rock-gnome",
        parentRace: parentGnome.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "林侏儒",
        nameEn: "Forest Gnome",
        code: "race:forest-gnome",
        parentRace: parentGnome.id,
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "斑貓人",
        nameEn: "Tabaxi",
        code: "race:tabaxi",
      },
      {
        name: "蜥蜴人",
        nameEn: "Lizardfolk",
        code: "race:lizardfolk",
      },
      {
        name: "天狗",
        nameEn: "Kenku",
        code: "race:kenku",
      },
      {
        name: "狗頭人",
        nameEn: "Kobold",
        code: "race:kobold",
      },
    ].map((payload) =>
      createIfNotExist("races", payload, { code: payload.code })
    )
  );

  const parentClses = [
    {
      name: "戰士",
      nameEn: "Fighter",
      code: "parentCls:fighter",
    },
    {
      name: "野蠻人",
      nameEn: "Barbarian",
      code: "parentCls:barbarian",
    },
    {
      name: "聖騎士",
      nameEn: "Paladin",
      code: "parentCls:paladin",
    },
    {
      name: "盜賊",
      nameEn: "Rogue",
      code: "parentCls:rogue",
    },
    {
      name: "吟遊詩人",
      nameEn: "Bard",
      code: "parentCls:bard",
    },
    {
      name: "牧師",
      nameEn: "Priest",
      code: "parentCls:priest",
    },
    {
      name: "武僧",
      nameEn: "Monk",
      code: "parentCls:monk",
    },
    {
      name: "遊俠",
      nameEn: "Ranger",
      code: "parentCls:ranger",
    },
    {
      name: "德魯伊",
      nameEn: "Druid",
      code: "parentCls:druid",
    },
    {
      name: "魔導師",
      nameEn: "Warlock",
      code: "parentCls:warlock",
    },
    {
      name: "術士",
      nameEn: "Sorcerer",
      code: "parentCls:sorcerer",
    },
    {
      name: "法師",
      nameEn: "Wizard",
      code: "parentCls:wizard",
    },
  ];

  for (const parentClsPayload of parentClses) {
    const parentCls = await createIfNotExist(
      "clses",
      {
        ...parentClsPayload,
        ruleset: DND5E.id,
        rulebook: PHB.id,
        isParentCls: false,
      },
      { code: parentClsPayload.code }
    );
    for (let i = 1; i <= 20; i++) {
      await createIfNotExist(
        "clses",
        {
          name: `${parentCls.name}${i}`,
          nameEn: `${parentCls.nameEn}${i}`,
          code: `cls:${parentCls.nameEn.toLowerCase()}${i}`,
          level: i,
          parentCls: parentCls.id,
          ruleset: DND5E.id,
          rulebook: PHB.id,
        },
        { code: `cls:${parentCls.nameEn.toLowerCase()}${i}` }
      );
    }
  }

  await Promise.all(
    [
      {
        name: "罪犯",
        nameEn: "Criminal",
        code: "background:criminal",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "隱士",
        nameEn: "Hermit",
        code: "background:hermit",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "貴族",
        nameEn: "Noble",
        code: "background:noble",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "學者",
        nameEn: "Sage",
        code: "background:sage",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "孤兒",
        nameEn: "Urchin",
        code: "background:urchin",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "間謀",
        nameEn: "Spy",
        code: "background:spy",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "騎士",
        nameEn: "Knight",
        code: "background:knight",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "角鬥士",
        nameEn: "Gladiator",
        code: "background:gladiator",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "海盜",
        nameEn: "Pirate",
        code: "background:pirate",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "公會商人",
        nameEn: "Guild Merchant",
        code: "background:guild-merchant",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "侍僧",
        nameEn: "Acolyte",
        code: "background:acolyte",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "詐欺師",
        nameEn: "Charlatan",
        code: "background:charlatan",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "藝人",
        nameEn: "Entertainer",
        code: "background:entertainer",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "平民英雄",
        nameEn: "Folk Hero",
        code: "background:folk-hero",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "水手",
        nameEn: "Sailor",
        code: "background:sailor",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "化外之民",
        nameEn: "Outlander",
        code: "background:outlander",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "公會工匠",
        nameEn: "Guild Artisan",
        code: "background:guild-artisan",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },
      {
        name: "士兵",
        nameEn: "Soldier",
        code: "background:soldier",
        ruleset: DND5E.id,
        rulebook: PHB.id,
      },

      {
        name: "遠行者",
        nameEn: "Far Traveler",
        code: "background:far-traveler",
        ruleset: DND5E.id,
        rulebook: SCAG.id,
      },
      {
        name: "烏斯伽部落成員",
        nameEn: "Uthgardt Tribe Member",
        code: "background:uthgardt-tribe-member",
        ruleset: DND5E.id,
        rulebook: SCAG.id,
      },
      {
        name: "傭兵老將",
        nameEn: "Mercenary Veteran",
        code: "background:mercenary-veteran",
        ruleset: DND5E.id,
        rulebook: SCAG.id,
      },
      {
        name: "修院學士",
        nameEn: "Cloistered Scholar",
        code: "background:cloistered-scholar",
        ruleset: DND5E.id,
        rulebook: SCAG.id,
      },
      {
        name: "調查員",
        nameEn: "Investigator",
        code: "background:investigator",
        ruleset: DND5E.id,
        rulebook: SCAG.id,
      },
      {
        name: "城市守衛",
        nameEn: "City Watch",
        code: "background:city-watch",
        ruleset: DND5E.id,
        rulebook: SCAG.id,
      },
      {
        name: "城市賞金獵人",
        nameEn: "Urban Bounty Hunter",
        code: "background:urban-bounty-hunter",
        ruleset: DND5E.id,
        rulebook: SCAG.id,
      },
      {
        name: "教團騎士",
        nameEn: "Knight of the Order",
        code: "background:knight-of-the-order",
        ruleset: DND5E.id,
        rulebook: SCAG.id,
      },
      {
        name: "朝臣",
        nameEn: "Courtier",
        code: "background:courtier",
        ruleset: DND5E.id,
        rulebook: SCAG.id,
      },
      {
        name: "氏族工匠",
        nameEn: "Clan Crafter",
        code: "background:clan-crafter",
        ruleset: DND5E.id,
        rulebook: SCAG.id,
      },
      {
        name: "派系特工",
        nameEn: "Faction Agent",
        code: "background:faction-agent",
        ruleset: DND5E.id,
        rulebook: SCAG.id,
      },
      {
        name: "深水城貴族",
        nameEn: "Vaterdhavian Noble",
        code: "background:vaterdhavian-noble",
        ruleset: DND5E.id,
        rulebook: SCAG.id,
      },
      {
        name: "繼承者",
        nameEn: "Inheritor",
        code: "background:inheritor",
        ruleset: DND5E.id,
        rulebook: SCAG.id,
      },
    ].map((payload) =>
      createIfNotExist("backgrounds", payload, { code: payload.code })
    )
  );

  await Promise.all(
    [
      {
        name: "蓋亞-大地之母",
        nameEn: "Gaia",
        code: "deity:gaia",
        ruleset: DND5E.id,
        rulebook: TOCC.id,
      },
      {
        name: "凜-風神",
        nameEn: "Blow",
        code: "deity:blow",
        ruleset: DND5E.id,
        rulebook: TOCC.id,
      },
      {
        name: "碧-水神",
        nameEn: "Azure",
        code: "deity:azure",
        ruleset: DND5E.id,
        rulebook: TOCC.id,
      },
      {
        name: "熾-火神",
        nameEn: "Blaze",
        code: "deity:blaze",
        ruleset: DND5E.id,
        rulebook: TOCC.id,
      },
      {
        name: "瑪拉-法則神",
        nameEn: "Marrah",
        code: "deity:marrah",
        ruleset: DND5E.id,
        rulebook: TOCC.id,
      },
      {
        name: "奈落-死神",
        nameEn: "Null",
        code: "deity:null",
        ruleset: DND5E.id,
        rulebook: TOCC.id,
      },
      {
        name: "阿波羅-太陽神",
        nameEn: "Apollo",
        code: "deity:apollo",
        ruleset: DND5E.id,
        rulebook: TOCC.id,
      },
      {
        name: "德婕-發明與豐收神",
        nameEn: "Disisse",
        code: "deity:disisse",
        ruleset: DND5E.id,
        rulebook: TOCC.id,
      },
      {
        name: "密拉-治療女神",
        nameEn: "Milla",
        code: "deity:milla",
        ruleset: DND5E.id,
        rulebook: TOCC.id,
      },
      {
        name: "海姆達-戰神",
        nameEn: "Helmdt",
        code: "deity:helmdt",
        ruleset: DND5E.id,
        rulebook: TOCC.id,
      },
      {
        name: "秩序-秩序神",
        nameEn: "cosmos",
        code: "deity:cosmos",
        ruleset: DND5E.id,
        rulebook: TOCC.id,
      },
    ].map((payload) =>
      createIfNotExist("deities", payload, { code: payload.code })
    )
  );
})();
