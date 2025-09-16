<script>
  import { onMount } from "svelte";
  import { TextField, TextArea } from "svelte-elegant";
  let entries = [];
  let title = "";
  let content = "";
  let date = "";

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
  <TextField bind:value={date} type="date" label="Date" required />
  <TextField bind:value={title} label="Title" required />
  <div style:margin-top="5px">
    <TextArea bind:value={content} label="Content"></TextArea>
  </div>
  <button>Добавить запись</button>
</form>

<ul>
  {#each entries as e}
    <li>
      <strong>{e.title}</strong> — {e.content} <em>({e.created_at})</em>
    </li>
  {/each}
</ul>
