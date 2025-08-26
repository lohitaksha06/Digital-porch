"use client"
import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function ToastFromSearchParam() {
  const search = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const message = useMemo(() => {
    if (search.get('edited')) return 'Changes saved.'
    if (search.get('deleted')) return 'Post deleted.'
    return ''
  }, [search])

  useEffect(() => {
    if (!message) return
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      // remove query params
      router.replace(pathname)
    }, 2500)
    return () => clearTimeout(t)
  }, [message, pathname, router])

  if (!visible || !message) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="rounded-md bg-gray-900 text-white px-4 py-2 shadow-lg text-sm">
        {message}
      </div>
    </div>
  )
}
