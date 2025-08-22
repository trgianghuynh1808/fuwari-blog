import { getSupabaseClient } from '../lib/supabase';

export async function getCommentCount(postSlug: string): Promise<number> {
  try {
    const supabase = getSupabaseClient();
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_slug', postSlug);

    if (error) {
      console.error('Error getting comment count:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('Error getting comment count:', err);
    return 0;
  }
}

export async function getCommentCountsForPosts(postSlugs: string[]): Promise<Record<string, number>> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('comments')
      .select('post_slug')
      .in('post_slug', postSlugs);

    if (error) {
      console.error('Error getting comment counts:', error);
      return {};
    }

    // Count comments per post
    const counts: Record<string, number> = {};
    postSlugs.forEach(slug => {
      counts[slug] = 0;
    });

    data?.forEach(comment => {
      if (counts[comment.post_slug] !== undefined) {
        counts[comment.post_slug]++;
      }
    });

    return counts;
  } catch (err) {
    console.error('Error getting comment counts:', err);
    return {};
  }
}
