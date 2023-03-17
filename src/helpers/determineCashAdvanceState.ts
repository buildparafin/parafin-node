import { CashAdvanceState, ParafinResponse } from '../types'

const determineCashAdvanceState = ({
  approvalAmount,
  acceptedAmount,
  verified,
}: ParafinResponse): CashAdvanceState => {
  if (!acceptedAmount && !approvalAmount) return 'no_offer'
  if (!acceptedAmount && approvalAmount) return 'offer'
  if (acceptedAmount && !verified) return 'pending'
  if (acceptedAmount && verified) return 'advance'

  return null
}

export default determineCashAdvanceState
