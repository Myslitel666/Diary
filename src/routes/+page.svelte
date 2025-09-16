<script>
  import { onMount } from "svelte";
  import { TextField, TextArea, Box, Button, Modal } from "svelte-elegant";
  import { themeStore, themeMode } from "svelte-elegant/stores";
  import { Pen } from "svelte-elegant/icons-elegant";
  let isEntryModalOpen = false;
  let entries = [];
  let title = "";
  let content = "";
  let date = "";
  let boxSize = "220px";
  let modal = {
    title: "",
    content: "",
    date: "",
  };

  async function loadEntries() {
    const res = await fetch("/api/entries");
    entries = await res.json();
  }

  async function addEntry() {
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, title, content }),
    });
    title = "";
    content = "";
    loadEntries();
  }
  onMount(loadEntries);
</script>

<div class="container">
  <Button
    variant="Outlined"
    width={boxSize}
    height={boxSize}
    fontSize="20px"
    onClick={() => {
      isEntryModalOpen = true;
    }}
  >
    <div class="create-button flex">
      <Pen size="45px" />
      <p style:color={$themeStore.palette.primary}>Create New Diary Entry</p>
    </div>
  </Button>
  {#each entries as e}
    <Button
      variant="Outlined"
      borderColor={$themeStore.border.elegant.color}
      bgColorHover={$themeStore.surface.ghost.background}
      width={boxSize}
      height={boxSize}
      onClick={() => {
        isEntryModalOpen = true;
      }}
    >
      <div class="flex entry" style:width={boxSize} style:height={boxSize}>
        <p style:font-weight="600" style:color={$themeStore.palette.primary}>
          {e.title}
        </p>
        <p>{e.content}</p>
        <p
          class="created-time"
          style:color={$themeMode === "light" ? "#ccc" : "#555"}
        >
          {e.date.slice(0, 10)}
        </p>
      </div>
    </Button>
  {/each}
  <Modal bind:isOpen={isEntryModalOpen} width="400px">
    <TextField
      bind:value={modal.date}
      width="100%"
      type="date"
      label="Date"
      required
    />
    <div style:margin-top="9px">
      <TextField bind:value={modal.title} width="100%" label="Title" required />
    </div>
    <div style:margin-top="9px">
      <TextArea bind:value={modal.content} width="100%" label="Content"
      ></TextArea>
    </div>
    <Button onClick={addEntry} marginTop="9px" width="100%">Create Entry</Button
    >
  </Modal>
</div>

<style>
  .container {
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap; /* ← Это переносит на новую строку */
    gap: 10px;
  }

  .created-time {
    position: absolute;
    bottom: 10px;
    right: 12px;
    font-size: 16px;
  }

  .flex {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .entry {
    position: relative;
    width: 100%;
    gap: 7px;
    height: 100%;
  }

  .create-button {
    align-items: center;
    gap: 12px;
    padding: 15px;
  }
</style>
