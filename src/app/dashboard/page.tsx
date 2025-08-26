import Link from 'next/link';
import '../../styles/main.css';
import '../../styles/auth.css'; // You may not need this stylesheet anymore
import styles from './Dashboard.module.css'; // We'll create this for custom styles

// Import a server-side Supabase client. You'll need to create this helper.
// See instructions below.
import { createClient } from '@/utils/supabase/server'; 

// This component is now an async Server Component
const DashboardPage = async () => {
  const supabase = createClient();
  
  // Fetch all posts, ordered by the newest first
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      content,
      created_at,
      image_url,
      profiles ( full_name )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return <p className={styles.error}>Could not fetch posts. Please try again later.</p>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Explore Stories</h1>
        <Link href="/newblog" className={styles.newPostButton}>
          + Create New Post
        </Link>
      </div>
      
      {posts.length === 0 ? (
        <div className={styles.noPosts}>
          <h2>No stories yet.</h2>
          <p>Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <div key={post.id} className={styles.postCard}>
              {post.image_url && <img src={post.image_url} alt={post.title} className={styles.postImage} />}
              <div className={styles.cardContent}>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.postAuthor}>By {post.profiles?.full_name || 'Anonymous'}</p>
                <p className={styles.postSnippet}>
                  {post.content ? post.content.substring(0, 100) + '...' : ''}
                </p>
                <p className={styles.postDate}>
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                {/* This link will eventually go to a detailed post page */}
                <Link href={`/posts/${post.id}`} className={styles.readMore}>Read More</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;