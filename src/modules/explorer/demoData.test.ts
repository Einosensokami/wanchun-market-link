import { describe, expect, it } from 'vitest'
import { getRecommendation, intentOptions } from './demoData'

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
})
