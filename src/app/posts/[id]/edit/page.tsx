"use client"
import { useEffect, useState, useTransition } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Button from '@/components/Button'
import { createClient } from '@/utils/supabase/client'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params?.id as string
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, user_id')
        .eq('id', id)
        .single()
      if (error || !data) {
        setError(error?.message || 'Post not found')
      } else if (data.user_id !== user.id) {
        setError('You do not have permission to edit this post.')
      } else {
        setTitle(data.title || '')
        setContent(data.content || '')
      }
      setLoading(false)
    }
    if (id) load()
  }, [id, router, supabase])

  const save = async () => {
    setError(null)
    startTransition(async () => {
      const { error } = await supabase
        .from('posts')
        .update({ title, content })
        .eq('id', id)
  if (error) setError(error.message)
  else router.push(`/posts/${id}?edited=1`)
    })
  }

  if (loading) return <div>Loading…</div>

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="content-area">
          <Button variant="secondary" className="back-button" onClick={() => router.push(`/posts/${id}`)}>← Back to Post</Button>
          <div className="editor">
            {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}
            <input
              className="editor-title"
              type="text"
              placeholder="Enter a captivating title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="editor-content"
              placeholder="Write your thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
            />
            <div className="editor-actions">
              <Button onClick={save} disabled={isPending}>{isPending ? 'Saving…' : 'Save Changes'}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
