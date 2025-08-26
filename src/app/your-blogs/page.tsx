import Link from 'next/link'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { createClient } from '@/utils/supabase/server'
import { deletePost } from '@/app/actions'
import DeletePostButton from '@/components/DeletePostButton'
import ToastFromSearchParam from '@/components/ToastFromSearchParam'
import { Suspense } from 'react'

// Module-scoped server action wrapper that returns void for <form action>
export async function handleDelete(formData: FormData): Promise<void> {
  'use server'
  await deletePost(formData)
}

const YourBlogsPage = async () => {
  const supabase = await createClient()

  // 1) Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2) Fetch only the user's posts
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, content, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })


  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <Suspense fallback={null}>
        <ToastFromSearchParam />
      </Suspense>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center pb-6 border-b border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Blogs</h1>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              ← Go Back
            </Link>
            <Link
              href="/newblog"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              + Create New Post
            </Link>
          </div>
        </div>

        {error && (
          <p className="text-red-500">Error fetching your posts: {error.message}</p>
        )}

        {!error && (!posts || posts.length === 0) && (
          <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700">You haven't written any stories yet.</h2>
            <p className="text-gray-500 mt-2">Click "Create New Post" to get started!</p>
          </div>
        )}

        {posts && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
                <div className="p-6 flex-grow">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">{post.title}</h2>
                  <p className="text-gray-600">
                    {post.content ? post.content.substring(0, 120) + '...' : 'No content preview.'}
                  </p>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">{formatDate(post.created_at)}</p>
                  <div className="flex justify-between items-center">
                    <Link href={`/posts/${post.id}`} className="font-semibold text-purple-600 hover:text-purple-800">Read More →</Link>
                    <DeletePostButton postId={post.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default YourBlogsPage
