<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getCommentCount } from '../utils/comment-utils';
  import { i18n } from '../i18n/translation';
  import Key from '../i18n/i18nKey';

    export let postSlug: string;
  export let isListPage: boolean = false;

  let commentCount = 0;
  let loading = true;
  let error = false;

  // Function to manually refresh comment count
  export function refresh() {
    loadCommentCount();
  }

  // Function to handle comment count click
  function handleCommentCountClick() {
    if (isListPage) {
      // On list pages, navigate to the post details page
      window.location.href = `/posts/${postSlug}/`;
    } else {
      // On detail pages, scroll to comment section
      const commentSection = document.getElementById('comments-section');
      if (commentSection) {
        commentSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
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
  <span class="text-black/30 dark:text-white/30 cursor-default">...</span>
{:else if error}
  <span class="text-black/30 dark:text-white/30 cursor-default">0</span>
{:else}
  <button
    on:click={() => handleCommentCountClick()}
    class="text-black/30 dark:text-white/30 hover:text-black/50 dark:hover:text-white/50 transition-colors cursor-pointer flex items-center gap-1 group"
    title={isListPage ? i18n(Key.viewPost) : i18n(Key.scrollToComments)}
  >
    <span>{commentCount} {" " + i18n(commentCount === 1 ? Key.commentCount : Key.commentsCount)}</span>
    <span class="opacity-0 group-hover:opacity-100 transition-opacity text-xs">↓</span>
  </button>
{/if}
