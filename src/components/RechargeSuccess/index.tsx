'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

function CheckoutSuccessTemplate() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.size > 0) {
      window.location.href = '/app'
    }
  }, [searchParams.size])

  return (
    <div className="flex items-center justify-center pt-4">
      <div>
        <h1>Redirecting you to the app</h1>
      </div>
    </div>
  )
}

export default CheckoutSuccessTemplate
