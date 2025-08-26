"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import '../../styles/main.css';
import Link from 'next/link'

type Post = { id: string | number; title: string; content: string; created_at: string };

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [mutualsCount, setMutualsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);

      // Load profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('display_name, bio, avatar_url')
        .eq('id', user.id)
        .maybeSingle();
      setDisplayName(prof?.display_name || user.user_metadata?.name || user.email?.split('@')[0] || '');
      setBio(prof?.bio || '');
      setAvatarUrl(prof?.avatar_url || null);

      // Load posts by this user
      const { data: p } = await supabase
        .from('posts')
        .select('id, title, content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setPosts(p || []);

      // Followers and mutuals (optional, fallback to 0 if table not present)
      try {
        const [{ data: followers }, { data: following }] = await Promise.all([
          supabase.from('follows').select('follower_id').eq('followee_id', user.id),
          supabase.from('follows').select('followee_id').eq('follower_id', user.id),
        ]);
        const followersSet = new Set((followers || []).map((x: any) => x.follower_id));
        const followingSet = new Set((following || []).map((x: any) => x.followee_id));
        setFollowersCount(followersSet.size);
        // Mutuals = intersection of followers and following
        let mutuals = 0;
        followersSet.forEach((id) => { if (followingSet.has(id)) mutuals++; });
        setMutualsCount(mutuals);
      } catch {
        setFollowersCount(0);
        setMutualsCount(0);
      }

      setLoading(false);
    };
    load();
  }, [supabase, user]);

  const avatarFallback = useMemo(() => (displayName || 'U').trim().charAt(0).toUpperCase(), [displayName]);

  if (isLoading || loading) return <div>Loading profile...</div>;
  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Avatar Center */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="rounded-full" style={{ width: 120, height: 120, objectFit: 'cover' }} />
            ) : (
              <div className="rounded-full bg-gray-200 flex items-center justify-center" style={{ width: 120, height: 120 }}>
                <span className="text-3xl text-gray-600">{avatarFallback}</span>
              </div>
            )}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">{displayName}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
          <div className="mt-4 flex gap-3">
            <Button variant="secondary" onClick={() => alert("This feature hasn't been made yet.")}>Change Avatar</Button>
            <Link href="/settings" className="inline-flex items-center px-4 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">Edit Profile</Link>
          </div>
        </div>

        {/* Bio */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Bio</h2>
          <p className="mt-2 text-gray-700 whitespace-pre-wrap">{bio || 'No bio yet.'}</p>
        </section>

        {/* Stats */}
        <section className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-white border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold">{followersCount}</div>
            <div className="text-sm text-gray-500">Followers</div>
          </div>
          <div className="rounded-lg bg-white border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold">{mutualsCount}</div>
            <div className="text-sm text-gray-500">Mutuals</div>
          </div>
          <div className="rounded-lg bg-white border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold">{posts.length}</div>
            <div className="text-sm text-gray-500">Blogs</div>
          </div>
        </section>

        {/* Blogs written */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Blogs Written</h2>
            <Link href="/your-blogs" className="text-sm font-semibold text-purple-600 hover:text-purple-800">Manage →</Link>
          </div>
          {posts.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/posts/${post.id}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{post.content ? post.content.slice(0, 100) + '…' : 'No preview.'}</p>
                  <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-gray-600">No blogs yet. <Link href="/newblog" className="text-purple-600">Write your first one.</Link></div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;