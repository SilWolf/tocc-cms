const lightFormat = require("date-fns/lightFormat");

const formatGameToDescription = (game) => `#${game.code}\n
Game ${game.code} - ${game.title}
時間: ${lightFormat(new Date(game.startAt), "yyyy-MM-dd HH:mm")}
地點: ${game.city?.name}
等級: lv${game.lvMin}-${game.lvMax}
DM: ${game.dm?.name}
人數: ${game.capacityMin}-${game.capacityMax}
費用: lv1-4 -> $100, lv5+ -> $120 (收費包括: 場地費用及DM服務費 *)
〔任務日期：第三紀元${lightFormat(
  game.worldStartAt ? new Date(game.worldStartAt) : new Date(),
  `yyyy年MM月dd日`
)}〕

故事:
${game.description}

${game.remark}`;

module.exports = {
  formatGameToDescription,
};
