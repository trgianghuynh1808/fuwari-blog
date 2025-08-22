<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getCommentCount } from '../utils/comment-utils';
  import { i18n } from '../i18n/translation';
  import Key from '../i18n/i18nKey';

  export let postSlug: string;

  let commentCount = 0;
  let loading = true;
  let error = false;

  // Function to manually refresh comment count
  export function refresh() {
    loadCommentCount();
  }

  async function loadCommentCount() {
    try {
      // Only fetch if we're in the browser and have Supabase credentials
      if (typeof window !== 'undefined') {
        const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
        const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          commentCount = await getCommentCount(postSlug);
        } else {
          // No Supabase credentials, show 0
          commentCount = 0;
        }
      }
    } catch (err) {
      console.error('Error loading comment count:', err);
      error = true;
    } finally {
      loading = false;
    }
  }

    onMount(() => {
    loadCommentCount();

    // Listen for custom event when a comment is added
    const handleCommentAdded = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.postSlug === postSlug) {
        // Only refresh if the comment was added to this post
        loadCommentCount();
      }
    };

    window.addEventListener('comment-added', handleCommentAdded);

    // Cleanup function
    return () => {
      window.removeEventListener('comment-added', handleCommentAdded);
    };
  });
</script>

{#if loading}
  <span class="text-black/30 dark:text-white/30">...</span>
{:else if error}
  <span class="text-black/30 dark:text-white/30">0</span>
{:else}
  <span class="text-black/30 dark:text-white/30">
    {commentCount} {" " + i18n(commentCount === 1 ? Key.commentCount : Key.commentsCount)}
  </span>
{/if}
