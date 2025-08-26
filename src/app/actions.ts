'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// Secure server action to delete a post owned by the current user.
// Relies on Supabase RLS to enforce ownership.
export async function deletePost(formData: FormData) {
  const postId = formData.get('postId') as string | null
  if (!postId) return { error: 'Post ID is missing.' }

  const supabase = await createClient()

  // Ensure user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to delete a post.' }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) return { error: `Failed to delete post: ${error.message}` }

  // Refresh the Your Blogs page so the deleted post disappears immediately
  revalidatePath('/your-blogs')
  return { success: 'Post deleted successfully.' }
}
