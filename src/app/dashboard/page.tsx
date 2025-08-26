import Link from 'next/link';
import { createClient } from '@/utils/supabase/server'; // Use the SERVER client
import Navbar from '@/components/Navbar'; // Assuming you have a Navbar component

// This is a Server Component, so it can be async
const DashboardPage = async () => {
  // Correctly create the Supabase client. It's not an async function.
  const supabase = await createClient();
  
  // Fetch all posts from the 'posts' table
  // - Select only the columns you need
  // - Order them by 'created_at' in descending order (newest first)
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, content, created_at')
    .order('created_at', { ascending: false });

  // Helper function to format the date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center pb-6 border-b border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Stories</h1>
          <Link 
            href="/newblog" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            + Create New Post
          </Link>
        </div>

        {/* Error Handling State */}
        {error && (
          <div className="text-center py-10">
            <p className="text-red-500 font-semibold">Error fetching posts: {error.message}</p>
          </div>
        )}

        {/* No Posts State */}
        {!error && (!posts || posts.length === 0) && (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold text-gray-700">No stories yet.</h2>
            <p className="text-gray-500 mt-2">Why not be the first to share your thoughts?</p>
          </div>
        )}

        {/* Display Posts Grid */}
        {posts && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
                <div className="p-6 flex-grow">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {/* Create a snippet of the content */}
                    {post.content ? post.content.substring(0, 120) + '...' : ''}
                  </p>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">
                    {formatDate(post.created_at)}
                  </p>
                  <Link 
                    href={`/posts/${post.id}`} // This will be the next page to build
                    className="font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;