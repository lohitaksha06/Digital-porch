import Link from 'next/link';
import '../../styles/main.css';
import styles from './Dashboard.module.css'; 
import { createClient } from '@/utils/supabase/server'; // Use the SERVER client
import Navbar from '@/components/Navbar'; // Add a Navbar for consistency

const DashboardPage = async () => {
  const supabase = await createClient();
  
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

  return (
    <div className="app-container">
      <Navbar />
      <div className={styles.dashboardContainer}>
        <div className={styles.header}>
          <h1>Explore Stories</h1>
          <Link href="/newblog" className={styles.newPostButton}>
            + Create New Post
          </Link>
        </div>
        
        {error && <p className={styles.error}>Could not fetch posts.</p>}

        {posts && posts.length === 0 && (
          <div className={styles.noPosts}>
            <h2>No stories yet. Be the first to share!</h2>
          </div>
        )}

        {posts && (
          <div className={styles.postsGrid}>
            {posts.map((post) => (
              <div key={post.id} className={styles.postCard}>
                {post.image_url && <img src={post.image_url} alt={post.title} className={styles.postImage} />}
                <div className={styles.cardContent}>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postAuthor}>By {'Anonymous'}</p>
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
    </div>
  );
};

export default DashboardPage;