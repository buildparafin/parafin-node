import { getDiscountAmount } from './responseManager'

describe('getDiscountAmount', () => {
  test('should return 0 if there are no discounts', () => {
    const result = getDiscountAmount(null, null, 0)
    expect(result).toBe(0)
  })

  test('should return 0 if there are no offers', () => {
    const result = getDiscountAmount(null, null, 0)
    expect(result).toBe(0)
  })

  test.each`
    offerMultiplier                       | chunkMultipler | amount   | expected
    ${{ multplier: '0.01' }}              | ${0.01}        | ${50000} | ${625}
    ${{ multplier: '0.001' }}             | ${0.01}        | ${50000} | ${400}
    ${{ multplier: '0.05' }}              | ${0.03}        | ${50000} | ${2000}
    ${{ fee_multiplier_factor: '0.01' }}  | ${0.01}        | ${50000} | ${625}
    ${{ fee_multiplier_factor: '0.001' }} | ${0.01}        | ${50000} | ${400}
    ${{ fee_multiplier_factor: '0.05' }}  | ${0.03}        | ${50000} | ${2000}
  `(
    'getDiscountAmount($offerMultiplier, $chunkMultipler, $amount) -> $expected',
    ({ offerMultiplier, multiplier, amount, expected }) => {
      const offerChunk = { multiplier }
      const discount = {
        multiplier: null,
        fee_multiplier_factor: null,
        ...offerMultiplier
      }
      expect(getDiscountAmount(discount, offerChunk, amount)).toBe(expected)
    }
  )
})
