export type VisitorIntent = 'worship' | 'culture' | 'food' | 'gift'

export interface IntentOption {
  id: VisitorIntent
  title: string
  description: string
  emoji: string
}

export interface DemoRecommendation {
  id: string
  name: string
  category: string
  description: string
  reason: string
  offer: string
  validUntil: string
}

export type ExplorerStage = 'welcome' | 'intent' | 'recommendation' | 'coupon'
