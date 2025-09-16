<script>
  import { onMount } from "svelte";
  import { TextField, TextArea, Box, Button, Modal } from "svelte-elegant";
  import { themeStore } from "svelte-elegant/stores";
  import { Pen } from "svelte-elegant/icons-elegant";
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

<div class="container">
  <Button variant="Outlined" width="220px" height="220px" fontSize="20px">
    <div class="create-button">
      <Pen size="50px" />
      <p style:color={$themeStore.palette.primary}>Create New Diary Entry</p>
    </div>
  </Button>
  {#each entries as e}
    <Button
      variant="Outlined"
      borderColor={$themeStore.border.elegant.color}
      bgColorHover={$themeStore.surface.ghost.background}
      width="220px"
      height="220px"
    >
      <div>
        <p>{e.title}</p>
        <p>{e.content}</p>
        <p>({e.created_at})</p>
      </div>
    </Button>
  {/each}
</div>
<TextField bind:value={date} type="date" label="Date" required />
<TextField bind:value={title} label="Title" required />
<div style:margin-top="5px">
  <TextArea bind:value={content} label="Content"></TextArea>
</div>
<button on:click={addEntry}>Добавить запись</button>

<style>
  .container {
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap; /* ← Это переносит на новую строку */
    gap: 10px;
  }

  .create-button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 15px;
  }
</style>
