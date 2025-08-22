<script lang="ts">
  import { onMount } from 'svelte';
  import { getSupabaseClient, type Comment, type CreateCommentData } from '../lib/supabase';
  import { i18n } from '../i18n/translation';
  import Key from '../i18n/i18nKey';

  export let postSlug: string;

  let comments: Comment[] = [];
  let nickname = '';
  let content = '';
  let showForm = false;
  let loading = false;
  let error = '';

  // Load comments from Supabase
  onMount(() => {
    loadComments();
  });

  async function loadComments() {
    try {
      loading = true;
      error = '';

      const supabase = getSupabaseClient();
      const { data, error: supabaseError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_slug', postSlug)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        error = i18n(Key.failedToLoadComments);
        return;
      }

      comments = data || [];
    } catch (err) {
      error = i18n(Key.failedToLoadComments);
      console.error('Error loading comments:', err);
      comments = [];
    } finally {
      loading = false;
    }
  }

        async function addComment() {
        if (!nickname.trim() || !content.trim()) return;

        try {
          loading = true;
          error = '';

          // Generate and save avatar for this user
          const avatar = generateChibiAvatar(nickname.trim());

          const commentData: CreateCommentData = {
            post_slug: postSlug,
            nickname: nickname.trim(),
            content: content.trim(),
            avatar_face: avatar.face,
            avatar_accessory: avatar.accessory,
            avatar_background: avatar.background
          };

      const supabase = getSupabaseClient();
      const { data, error: supabaseError } = await supabase
        .from('comments')
        .insert([commentData])
        .select()
        .single();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        error = i18n(Key.failedToPostComment);
        return;
      }

                if (data) {
            comments = [data, ...comments];

            // Reset form
            content = '';
            showForm = false;

            // Save nickname for future use
            saveNickname();

            // Dispatch custom event to notify comment count components
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('comment-added', {
                detail: { postSlug, commentCount: comments.length }
              }));
            }
          }
    } catch (err) {
      error = i18n(Key.failedToPostComment);
      console.error('Error posting comment:', err);
    } finally {
      loading = false;
    }
  }



  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function toggleForm() {
    showForm = !showForm;
    if (showForm) {
      // Load saved nickname if exists
      const savedNickname = localStorage.getItem('comment-nickname');
      if (savedNickname) {
        nickname = savedNickname;
      }
    }
  }

  function saveNickname() {
    if (nickname.trim()) {
      localStorage.setItem('comment-nickname', nickname.trim());
    }
  }

  // Generate a random chibi avatar based on nickname
  function generateChibiAvatar(nickname: string): { face: string; accessory: string; background: string } {
    const chibiParts = {
      faces: ['😊', '😄', '🤗', '😌', '😋', '🤩', '🥰', '😍', '🤠', '👻', '🐱', '🐰', '🐻', '🐸', '🦊', '🐯', '🦁', '🐮', '🐷', '🐙'],
      accessories: ['👓', '🎩', '👑', '🎀', '🌸', '⭐', '💫', '✨', '🌟', '💎', '🎪', '🎭', '🎨', '🎵', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤'],
      backgrounds: ['🌈', '🌺', '🍀', '🌻', '🌹', '🌷', '🌼', '🌸', '🌿', '🍃', '🌱', '🌳', '🌴', '🌵', '🌾', '🌽', '🍎', '🍊', '🍋', '🍇']
    };

    // Use nickname to generate consistent avatar for same user
    const hash = nickname.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    const faceIndex = Math.abs(hash) % chibiParts.faces.length;
    const accessoryIndex = Math.abs(hash >> 8) % chibiParts.accessories.length;
    const backgroundIndex = Math.abs(hash >> 16) % chibiParts.backgrounds.length;

    return {
      face: chibiParts.faces[faceIndex],
      accessory: chibiParts.accessories[accessoryIndex],
      background: chibiParts.backgrounds[backgroundIndex]
    };
  }
</script>

<div class="comments-section">
  <div class="comments-header">
            <h3 class="text-xl font-bold text-black/90 dark:text-white/90 mb-4">
          {i18n(Key.comments)} ({comments.length})
        </h3>

    <div class="flex gap-2">
      <button
        on:click={loadComments}
        class="btn-secondary px-3 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
        disabled={loading}
        title={i18n(Key.refreshComments)}
      >
        <span class="w-4 h-4">🔄</span>
      </button>

      <button
        on:click={toggleForm}
        class="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
        disabled={loading}
      >
        <span class="w-5 h-5 text-lg">💬</span>
        {showForm ? i18n(Key.cancel) : i18n(Key.addComment)}
      </button>
    </div>
  </div>

  {#if error}
    <div class="error-message bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-4 text-red-700 dark:text-red-300">
      {error}
      <button on:click={() => error = ''} class="ml-2 text-red-500 hover:text-red-700">✕</button>
    </div>
  {/if}



  {#if showForm}
    <div class="comment-form card-base p-6 mb-6">
      <div class="mb-4">
        <label for="nickname" class="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
          {i18n(Key.nickname)} *
        </label>
        <input
          id="nickname"
          type="text"
          bind:value={nickname}
          on:blur={saveNickname}
          placeholder={i18n(Key.enterNickname)}
          class="comment-input"
          required
        />
      </div>

      <div class="mb-4">
        <label for="content" class="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
          {i18n(Key.comment)} *
        </label>
        <textarea
          id="content"
          bind:value={content}
          placeholder={i18n(Key.shareThoughts)}
          rows="4"
          class="comment-textarea"
          required
        ></textarea>
      </div>

      <button
        on:click={addComment}
        disabled={!nickname.trim() || !content.trim() || loading}
        class="btn-primary px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
               transition-all hover:scale-105 disabled:hover:scale-100 flex items-center gap-2"
      >
        {#if loading}
          <span class="animate-spin">⏳</span>
        {:else}
          <span>📝</span>
        {/if}
        {loading ? i18n(Key.posting) : i18n(Key.postComment)}
      </button>
    </div>
  {/if}

  {#if loading && comments.length === 0}
    <div class="text-center py-8 text-black/50 dark:text-white/50">
      <span class="w-16 h-16 mx-auto mb-4 opacity-30 text-6xl block animate-pulse">⏳</span>
      <p>{i18n(Key.loadingComments)}</p>
    </div>
  {:else if comments.length === 0}
    <div class="text-center py-8 text-black/50 dark:text-white/50">
      <span class="w-16 h-16 mx-auto mb-4 opacity-30 text-6xl block">💭</span>
              <p>{i18n(Key.noCommentsYet)}</p>
    </div>
  {:else}
    <div class="comments-list space-y-4">
      {#each comments as comment (comment.id)}
        <div class="comment-item card-base p-4">
          <div class="flex justify-between items-start mb-2">
                              <div class="flex items-center gap-2">
                    <div class="comment-avatar-chibi">
                      <div class="chibi-container">
                        <div class="chibi-background">{comment.avatar_background}</div>
                        <div class="chibi-face">{comment.avatar_face}</div>
                        <div class="chibi-accessory">{comment.avatar_accessory}</div>
                      </div>
                    </div>
                    <span class="font-semibold text-black/80 dark:text-white/80">
                      {comment.nickname}
                    </span>
                  </div>

          </div>

          <p class="text-black/80 dark:text-white/80 mb-2 leading-relaxed">
            {comment.content}
          </p>

          <div class="text-xs text-black/50 dark:text-white/50">
            {formatDate(comment.created_at)}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .comments-section {
    @apply w-full;
  }

  .comments-header {
    @apply flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6;
  }

  .comment-form {
    @apply border border-gray-200 dark:border-gray-700;
  }

  .comment-item {
    @apply border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600;
  }

  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-medium;
  }

  .comment-avatar-chibi {
    @apply relative w-12 h-12 flex items-center justify-center;
  }

  .chibi-container {
    @apply relative w-full h-full flex items-center justify-center;
  }

  .chibi-background {
    @apply absolute inset-0 text-2xl opacity-20;
  }

  .chibi-face {
    @apply text-2xl z-10;
  }

  .chibi-accessory {
    @apply absolute -top-1 -right-1 text-sm opacity-80;
  }
</style>
