// data.js
// Portfolio Demo — 所有公司、人員、客戶、金額及營運數據皆為模擬資料
// 資料結構刻意集中於此檔，方便日後編輯／替換

const REPORT_DATA = {
  company: "NOVA Cross-Border",
  department: "Business Development",
  year: 2026,
  lastUpdated: "2026/07/13",

  months: ["2026/01", "2026/02"],

  // 每月各業務(顧問)分配 / 已接觸 / 已開會名單數
  // 已接觸未開會 = contacted - meetings；未接觸 = assigned - contacted
  consultants: {
    "2026/01": [
      { name: "Alex",   assigned: 60, contacted: 42, meetings: 6 },
      { name: "Jamie",  assigned: 62, contacted: 45, meetings: 8 },
      { name: "Morgan", assigned: 58, contacted: 40, meetings: 5 }
    ],
    "2026/02": [
      { name: "Alex",   assigned: 50, contacted: 38, meetings: 6 },
      { name: "Jamie",  assigned: 48, contacted: 34, meetings: 5 },
      { name: "Morgan", assigned: 52, contacted: 39, meetings: 7 }
    ]
  },

  // 名單來源分佈（總數需等於該月總名單數）
  leadSources: {
    "2026/01": { "官網": 108, "官方LINE": 45, "Meta廣告": 27 },
    "2026/02": { "官網": 90,  "官方LINE": 38, "Meta廣告": 22 }
  },

  // 未接觸原因分佈（總數需等於該月未接觸數）
  uncontactedReasons: {
    "2026/01": { "未接": 30, "無回覆": 15, "資訊不足": 8 },
    "2026/02": { "未接": 22, "無回覆": 11, "資訊不足": 6 }
  },

  // 本月會議主要來源 / 最高轉化來源
  meetingSourceInsight: {
    "2026/01": { topSource: "官網", topSourceRate: 63, bestConvertSource: "官網", bestConvertRate: 11.1 },
    "2026/02": { topSource: "官網", topSourceRate: 61, bestConvertSource: "官網", bestConvertRate: 12.2 }
  },

  // 已開會名單明細（供 KPI 卡「查看明細」展開使用）
  // 每月筆數需等於該月「已開會」總數，且每位諮詢師筆數需等於其 meetings 數
  meetingDetails: {
    "2026/01": [
      { client: "BluePeak Living", consultant: "Alex",   source: "官網",     date: "2026/01/04" },
      { client: "Mori Select",     consultant: "Alex",   source: "官方LINE", date: "2026/01/07" },
      { client: "UrbanNest",       consultant: "Alex",   source: "官網",     date: "2026/01/12" },
      { client: "Kite Studio",     consultant: "Alex",   source: "官網",     date: "2026/01/18" },
      { client: "Aster Lab",       consultant: "Alex",   source: "Meta廣告", date: "2026/01/22" },
      { client: "Northwood Design",consultant: "Alex",   source: "官網",     date: "2026/01/27" },
      { client: "Green Harbor",    consultant: "Jamie",  source: "官網",     date: "2026/01/03" },
      { client: "Luma Home",       consultant: "Jamie",  source: "官方LINE", date: "2026/01/06" },
      { client: "BluePeak Living", consultant: "Jamie",  source: "官網",     date: "2026/01/09" },
      { client: "Mori Select",     consultant: "Jamie",  source: "官網",     date: "2026/01/14" },
      { client: "UrbanNest",       consultant: "Jamie",  source: "Meta廣告", date: "2026/01/17" },
      { client: "Kite Studio",     consultant: "Jamie",  source: "官網",     date: "2026/01/21" },
      { client: "Aster Lab",       consultant: "Jamie",  source: "官方LINE", date: "2026/01/25" },
      { client: "Northwood Design",consultant: "Jamie",  source: "官網",     date: "2026/01/29" },
      { client: "Green Harbor",    consultant: "Morgan", source: "官網",     date: "2026/01/05" },
      { client: "Luma Home",       consultant: "Morgan", source: "官網",     date: "2026/01/10" },
      { client: "BluePeak Living", consultant: "Morgan", source: "Meta廣告", date: "2026/01/15" },
      { client: "Mori Select",     consultant: "Morgan", source: "官方LINE", date: "2026/01/20" },
      { client: "UrbanNest",       consultant: "Morgan", source: "官網",     date: "2026/01/26" }
    ],
    "2026/02": [
      { client: "Kite Studio",     consultant: "Alex",   source: "官網",     date: "2026/02/02" },
      { client: "Aster Lab",       consultant: "Alex",   source: "官網",     date: "2026/02/05" },
      { client: "Northwood Design",consultant: "Alex",   source: "官方LINE", date: "2026/02/09" },
      { client: "Green Harbor",    consultant: "Alex",   source: "官網",     date: "2026/02/13" },
      { client: "Luma Home",       consultant: "Alex",   source: "Meta廣告", date: "2026/02/17" },
      { client: "BluePeak Living", consultant: "Alex",   source: "官網",     date: "2026/02/21" },
      { client: "Mori Select",     consultant: "Jamie",  source: "官網",     date: "2026/02/03" },
      { client: "UrbanNest",       consultant: "Jamie",  source: "官方LINE", date: "2026/02/08" },
      { client: "Kite Studio",     consultant: "Jamie",  source: "官網",     date: "2026/02/14" },
      { client: "Aster Lab",       consultant: "Jamie",  source: "官網",     date: "2026/02/19" },
      { client: "Northwood Design",consultant: "Jamie",  source: "Meta廣告", date: "2026/02/24" },
      { client: "Green Harbor",    consultant: "Morgan", source: "官網",     date: "2026/02/04" },
      { client: "Luma Home",       consultant: "Morgan", source: "官網",     date: "2026/02/07" },
      { client: "BluePeak Living", consultant: "Morgan", source: "官方LINE", date: "2026/02/11" },
      { client: "Mori Select",     consultant: "Morgan", source: "官網",     date: "2026/02/16" },
      { client: "UrbanNest",       consultant: "Morgan", source: "Meta廣告", date: "2026/02/20" },
      { client: "Kite Studio",     consultant: "Morgan", source: "官網",     date: "2026/02/23" },
      { client: "Aster Lab",       consultant: "Morgan", source: "官方LINE", date: "2026/02/26" }
    ]
  }
};
