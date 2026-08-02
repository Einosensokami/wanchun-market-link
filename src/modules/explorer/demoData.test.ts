import { describe, expect, it } from 'vitest'
import { getRecommendation, intentOptions } from './demoData'

describe('explorer demo recommendations', () => {
  it('offers every supported visitor intent', () => {
    expect(intentOptions.map((option) => option.id)).toEqual(['worship', 'culture', 'food', 'gift'])
  })

  it('keeps worship recommendations on the verified demo merchant', () => {
    const recommendation = getRecommendation('worship')
    expect(recommendation.id).toBe('demo-spring-gift')
    expect(recommendation.offer).toContain('NT$300')
  })
})
