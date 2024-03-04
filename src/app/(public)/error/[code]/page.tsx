'use client'

import ErrorUI from '~/components/Error'
import useAuth from '~/utils/hooks/useAuth'

type ErrorPageProps = {
  params: {
    code: string
  }
}

const getMessageByCode = (code: string) => {
  const codeAsNumber = Number(code)
  if (codeAsNumber === 404) return 'Not found'
  if (codeAsNumber === 401) return 'Not authorized'
  return 'Unexpected Error'
}

export default function Error(props: ErrorPageProps) {
  const { user } = useAuth()
  const message = getMessageByCode(props.params.code)

  return <ErrorUI isAuthenticated={Boolean(user)} message={message} />
}
