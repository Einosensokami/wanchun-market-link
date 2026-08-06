import { describe, expect, it } from 'vitest'
import { getRecommendation, intentOptions, planJourneyFromMessage } from './demoData'

describe('explorer demo recommendations', () => {
  it('offers every supported visitor intent', () => {
    expect(intentOptions.map((option) => option.id)).toEqual(['worship', 'culture', 'food', 'gift'])
  })

  it('keeps each intent on a distinct controlled recommendation', () => {
    expect(getRecommendation('worship').id).toBe('demo-prayer-route')
    expect(getRecommendation('culture').id).toBe('demo-cultural-walk')
    expect(getRecommendation('food').id).toBe('demo-noodle-stop')
    expect(getRecommendation('gift').id).toBe('demo-spring-gift')
    expect(getRecommendation('gift').offer).toContain('NT$300')
  })

  it('maps a natural-language journey request only to supported controlled intents', () => {
    const plan = planJourneyFromMessage('陪長輩參拜，想吃午餐，也想帶伴手禮')
    expect(plan.detectedIntents).toEqual(['worship', 'food', 'gift'])
    expect(plan.primaryIntent).toBe('gift')
    expect(plan.summary).toContain('安心參拜、吃點在地美食、帶份台中伴手禮')
  })
})
