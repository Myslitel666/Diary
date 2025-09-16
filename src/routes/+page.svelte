<script>
  import { onMount } from "svelte";
  let entries = [];
  let title = "";
  let content = "";

  async function loadEntries() {
    const res = await fetch("/api/entries");
    entries = await res.json();
  }

  async function addEntry() {
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    title = "";
    content = "";
    loadEntries();
  }

  onMount(loadEntries);
</script>

<h1>Дневник</h1>

<form on:submit|preventDefault={addEntry}>
  <input bind:value={title} placeholder="Заголовок" required />
  <textarea bind:value={content} placeholder="Содержание"></textarea>
  <button>Добавить запись</button>
</form>

<ul>
  {#each entries as e}
    <li>
      <strong>{e.title}</strong> — {e.content} <em>({e.created_at})</em>
    </li>
  {/each}
</ul>
