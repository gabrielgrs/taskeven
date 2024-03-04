'use client'

import { useEffect } from 'react'

export default function InviteTemplateUI({ token }: { token: string }) {
  useEffect(() => {
    if (token) {
      // Verify middleware
      window.location.href = `/auth?token=${token}`
    }
  }, [token])

  return <div>Invite</div>
}
