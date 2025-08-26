import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/utils/supabase/server'
import ToastFromSearchParam from '@/components/ToastFromSearchParam'

type PageProps = { params: { id: string } }

const PostDetailPage = async ({ params }: PageProps) => {
  const supabase = await createClient()
  const id = params.id

  // Fetch post and current user
  const [postRes, userRes] = await Promise.all([
    supabase
      .from('posts')
      .select('id, title, content, created_at, user_id')
      .eq('id', id)
      .single(),
    supabase.auth.getUser(),
  ])

  const { data: post, error } = postRes
  const user = userRes.data.user

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/dashboard" className="text-purple-600 hover:text-purple-800">← Back</Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Post not found</h1>
          {error && <p className="text-sm text-gray-500 mt-2">{error.message}</p>}
        </main>
      </div>
    )
  }

  const canEdit = user && user.id === post.user_id
  const maybeTags = (post as any).tags as (string | null | undefined)
  const tags = (maybeTags || '')
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
  <ToastFromSearchParam />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-purple-600 hover:text-purple-800">← Back</Link>
          {canEdit && (
            <Link
              href={`/posts/${post.id}/edit`}
              className="inline-flex items-center px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Edit
            </Link>
          )}
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">{post.title}</h1>
        <p className="mt-2 text-sm text-gray-500">
          {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        {!!tags.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map(t => (
              <span key={t} className="text-sm text-purple-700">#{t}</span>
            ))}
          </div>
        )}

        <article className="prose prose-purple max-w-none mt-8">
          <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
        </article>
      </main>
    </div>
  )
}

export default PostDetailPage
