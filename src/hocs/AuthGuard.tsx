'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { getLocalizedUrl } from '@/utils/i18n'
import { usePathname } from 'next/navigation'
export default function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentPath = usePathname()

  const [role, setRole] = useState<string | null>(null)
  useEffect(() => {
    const getUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setRole(session?.user.user_metadata?.roleId || null)
    }
    getUserRole()
  }, [])

  const userRoutes = "/dashboards/crm";

  const superAdminRoutes = "/apps/user/list";

  const adminRoutes = "/apps/kanban";

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Error fetching session:', error.message)
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(!!data.session)
      }
    }

    checkSession()
  }, [])

  if (isAuthenticated === null) {
    return <div className={`z-50 absolute h-screen w-screen flex bg-white/80 items-center justify-center `}>
      loading...
    </div>
  }

  if (!isAuthenticated) {
    router.push(`/login?lang=${locale}`)
    return null
  }

  if (role == '47ac0121-c33b-44a6-be05-4715265f0bd9' && !currentPath.startsWith(superAdminRoutes)) {
    let redirectURL = searchParams.get('redirectTo') ?? superAdminRoutes;
    router.replace(getLocalizedUrl(redirectURL, locale as Locale))
  }

  if (role == 'ebd63b96-fc4e-4222-b2cc-55f31d05e6e0' && !currentPath.startsWith(adminRoutes)) {
    let redirectURL = searchParams.get('redirectTo') ?? adminRoutes;
    router.replace(getLocalizedUrl(redirectURL, locale as Locale))
  }

  if (role == '107f25b5-9046-41e5-9abf-580e9638e08c' && !currentPath.startsWith(userRoutes)) {
    let redirectURL = searchParams.get('redirectTo') ?? userRoutes;
    router.replace(getLocalizedUrl(redirectURL, locale as Locale))
  }

  return <>
    {children}
  </>
}

