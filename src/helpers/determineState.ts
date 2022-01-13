type StateProps = {
  approvalAmount: string | null
  acceptedAmount: string | null
  verified: boolean | null
}

const determineState = ({
  approvalAmount,
  acceptedAmount,
  verified
}: StateProps) => {
  if (!acceptedAmount && !approvalAmount) return 'no_offer'
  if (!acceptedAmount && approvalAmount) return 'offer'
  if (acceptedAmount && !verified) return 'pending'
  if (acceptedAmount && verified) return 'advance'

  return null
}

export default determineState
