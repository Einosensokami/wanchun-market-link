import type { DemoRecommendation, IntentOption, JourneyPlan, VisitorIntent } from './types'

export const intentOptions: IntentOption[] = [
  { id: 'worship', title: '安心參拜', description: '3 分鐘掌握參拜動線', emoji: '🙏' },
  { id: 'culture', title: '認識廟宇故事', description: '看看萬春宮的文化細節', emoji: '🏮' },
  { id: 'food', title: '吃點在地美食', description: '找個適合坐下吃飯的地方', emoji: '🍜' },
  { id: 'gift', title: '帶份台中伴手禮', description: '把在地心意一起帶回家', emoji: '🎁' },
]

const recommendations: Record<VisitorIntent, DemoRecommendation> = {
  worship: {
    id: 'demo-prayer-route', name: '萬春宮參拜導覽', category: '示範文化導覽',
    description: '用 3 分鐘掌握入口、參拜順序與主祀神明介紹。',
    reason: '依你的「安心參拜」需求，先給你清楚、不需輸入祈願內容的參訪動線。',
    offer: '文化導覽路線預覽', validUntil: '開放時間內',
  },
  culture: {
    id: 'demo-cultural-walk', name: '廟埕故事散步', category: '示範文化走讀',
    description: '從廟宇細節、街區記憶到周邊老建築，安排一段 15 分鐘散步。',
    reason: '依你的「認識廟宇故事」需求，推薦把文化內容延伸到附近街區。',
    offer: '文化故事點地圖預覽', validUntil: '隨時可看',
  },
  food: {
    id: 'demo-noodle-stop', name: '廟口食堂（示範）', category: '示範在地餐飲',
    description: '適合坐下吃一餐的廟口小店，步行約 3 分鐘。',
    reason: '依你的「吃點在地美食」需求，推薦不需趕路、可接續文化散步的一站。',
    offer: '今日菜單與店家資訊預覽', validUntil: '營業時間內',
  },
  gift: {
    id: 'demo-spring-gift', name: '春和餅舖', category: '示範伴手禮店家',
    description: '一間以在地糕點為主的示範店家，步行約 4 分鐘。',
    reason: '依你的「想帶伴手禮」需求，推薦最順路的示範選擇。',
    offer: '滿 NT$300 折 NT$30', validUntil: '今日 18:00 前',
  },
}

export const getRecommendation = (intent: VisitorIntent): DemoRecommendation => recommendations[intent]

const intentMatchers: Record<VisitorIntent, RegExp> = {
  worship: /參拜|拜拜|祈福|平安|長輩|長者|家人|家族/,
  culture: /文化|歷史|故事|導覽|建築|散步|走走/,
  food: /吃|餐|午餐|晚餐|美食|餓|喝|休息/,
  gift: /伴手禮|禮物|送人|糕餅|餅|帶回|特產/,
}

/**
 * Contest-safe natural-language intent interpretation. It only maps a message
 * to the four supported, verified content categories and never generates
 * religious advice or merchant facts.
 */
export function planJourneyFromMessage(message: string): JourneyPlan {
  const detectedIntents = (Object.keys(intentMatchers) as VisitorIntent[])
    .filter((intent) => intentMatchers[intent].test(message))

  const supportedIntents: VisitorIntent[] = detectedIntents.length > 0 ? detectedIntents : ['worship']
  const primaryIntent = supportedIntents.includes('gift')
    ? 'gift'
    : supportedIntents.includes('food')
      ? 'food'
      : supportedIntents[0]
  const labels = supportedIntents.map((intent) => intentOptions.find((option) => option.id === intent)?.title).join('、')

  return {
    primaryIntent,
    detectedIntents: supportedIntents,
    summary: detectedIntents.length > 0
      ? `我理解你想安排：${labels}。先替你排出最適合開始的一站。`
      : '我先以安心參拜為起點，提供不涉及個人祈願內容的參訪路線。',
  }
}
