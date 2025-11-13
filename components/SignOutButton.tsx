'use client'

import { signOut } from 'next-auth/react'

interface SignOutButtonProps {
  className?: string
}

export function SignOutButton({ className }: SignOutButtonProps) {
  const defaultClassName = "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"

  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className={className || defaultClassName}
    >
      Sign Out
    </button>
  )
}
