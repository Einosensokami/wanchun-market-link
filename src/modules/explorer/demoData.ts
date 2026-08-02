import type { DemoRecommendation, IntentOption, VisitorIntent } from './types'

export const intentOptions: IntentOption[] = [
  { id: 'worship', title: '安心參拜', description: '3 分鐘掌握參拜動線', emoji: '🙏' },
  { id: 'culture', title: '認識廟宇故事', description: '看看萬春宮的文化細節', emoji: '🏮' },
  { id: 'food', title: '吃點在地美食', description: '找個適合坐下吃飯的地方', emoji: '🍜' },
  { id: 'gift', title: '帶份台中伴手禮', description: '把在地心意一起帶回家', emoji: '🎁' },
]

const recommendations: Record<VisitorIntent, DemoRecommendation> = {
  worship: {
    id: 'demo-spring-gift', name: '春和餅舖', category: '示範伴手禮店家',
    description: '參拜後可順路帶一份台中風味小點，步行約 4 分鐘。',
    reason: '依你的「安心參拜」需求，推薦一個能把祝福帶回家的順路選擇。',
    offer: '滿 NT$300 折 NT$30', validUntil: '今日 18:00 前',
  },
  culture: {
    id: 'demo-spring-gift', name: '春和餅舖', category: '示範伴手禮店家',
    description: '看完文化故事後，步行約 4 分鐘就能帶走在地點心。',
    reason: '依你的「認識廟宇故事」需求，推薦延續在地記憶的伴手禮選擇。',
    offer: '滿 NT$300 折 NT$30', validUntil: '今日 18:00 前',
  },
  food: {
    id: 'demo-spring-gift', name: '春和餅舖', category: '示範伴手禮店家',
    description: '用餐後順路挑選小點，作為今天廟口散步的收尾。',
    reason: '依你的「在地美食」需求，推薦可延伸行程的示範店家與優惠。',
    offer: '滿 NT$300 折 NT$30', validUntil: '今日 18:00 前',
  },
  gift: {
    id: 'demo-spring-gift', name: '春和餅舖', category: '示範伴手禮店家',
    description: '一間以在地糕點為主的示範店家，步行約 4 分鐘。',
    reason: '依你的「想帶伴手禮」需求，推薦最順路的示範選擇。',
    offer: '滿 NT$300 折 NT$30', validUntil: '今日 18:00 前',
  },
}

export const getRecommendation = (intent: VisitorIntent): DemoRecommendation => recommendations[intent]
