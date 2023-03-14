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
    discount                                               | multiplier | amount   | expected
    ${{ multplier: '0.01', fee_multiplier_factor: null }}  | ${0.01}    | ${50000} | ${625}
    ${{ multplier: '0.001', fee_multiplier_factor: null }} | ${0.01}    | ${50000} | ${400}
    ${{ multplier: '0.05', fee_multiplier_factor: null }}  | ${0.03}    | ${50000} | ${2000}
    ${{ multplier: null, fee_multiplier_factor: '0.01' }}  | ${0.01}    | ${50000} | ${625}
    ${{ multplier: null, fee_multiplier_factor: '0.001' }} | ${0.01}    | ${50000} | ${400}
    ${{ multplier: null, fee_multiplier_factor: '0.05' }}  | ${0.03}    | ${50000} | ${2000}
  `(
    'getDiscountAmount($discount, $multiplier, $amount) -> $expected',
    ({ discount, multiplier, amount, expected }) => {
      const offer = {
        chunks: [
          {
            multiplier
          }
        ]
      }
      expect(getDiscountAmount(discount, offer, amount)).toBe(expected)
    }
  )
})
