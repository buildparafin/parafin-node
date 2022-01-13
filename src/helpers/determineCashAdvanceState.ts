type CashAdvanceStateProps = {
  approvalAmount: string | null
  acceptedAmount: string | null
  verified: boolean | null
}

const determineCashAdvanceState = ({
  approvalAmount,
  acceptedAmount,
  verified
}: CashAdvanceStateProps) => {
  if (!acceptedAmount && !approvalAmount) return 'no_offer'
  if (!acceptedAmount && approvalAmount) return 'offer'
  if (acceptedAmount && !verified) return 'pending'
  if (acceptedAmount && verified) return 'advance'

  return null
}

export default determineCashAdvanceState
