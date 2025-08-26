"use client"
import { useState, useTransition } from 'react'
import { deletePost } from '@/app/actions'
import { useRouter, usePathname } from 'next/navigation'

export default function DeletePostButton({ postId }: { postId: string | number }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  const confirmDelete = () => {
    const fd = new FormData()
    fd.set('postId', String(postId))
    startTransition(async () => {
      await deletePost(fd)
      setOpen(false)
  // Add a flag so pages can show a toast; stay on current path because server action revalidates
  const url = new URL(window.location.href)
  url.searchParams.set('deleted', '1')
  router.replace(url.pathname + '?' + url.searchParams.toString())
    })
  }

  return (
    <>
      <button
        type="button"
        className="text-sm font-medium text-red-500 hover:text-red-700"
        onClick={() => setOpen(true)}
      >
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={() => !isPending && setOpen(false)} />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Delete post?</h3>
            <p className="mt-2 text-sm text-gray-600">This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                onClick={confirmDelete}
                disabled={isPending}
              >
                {isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
