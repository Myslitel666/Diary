<script>
  import { onMount } from "svelte";
  import {
    TextField,
    TextArea,
    Button,
    Modal,
    ScrollbarContainer,
  } from "svelte-elegant";
  import { themeStore, themeMode } from "svelte-elegant/stores";
  import { Pen, Delete, Save } from "svelte-elegant/icons-elegant";
  let isEntryModalOpen = false;
  let isDeleteModalOpen = false;
  let isDetailsModalOpen = false;
  let isInitialized = false;
  let entries = [];
  let boxSize = "220px";

  let details = [
    {
      id: 1,
      entry_id: 1,
      content: "Detail aaa",
    },
    {
      id: 2,
      entry_id: 1,
      content: "Detail bbb",
    },
  ];

  let modal = {
    title: "",
    content: "",
    date: "",
    isCreate: false,
  };

  async function loadEntries() {
    const res = await fetch("/api/entries");
    entries = await res.json();
  }

  async function addEntry() {
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: modal.date,
        title: modal.title,
        content: modal.content,
      }),
    });
    loadEntries();
    isEntryModalOpen = false;
  }

  async function updateEntry() {
    await fetch("/api/entries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: modal.date,
        title: modal.title,
        content: modal.content,
        id: modal.id,
      }),
    });
    loadEntries();
    isEntryModalOpen = false;
  }

  async function deleteEntry() {
    await fetch("/api/entries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: modal.id,
      }),
    });
    loadEntries();
    isEntryModalOpen = false;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      weekday: "short", // 'Fri' вместо 'Friday'
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  onMount(() => {
    loadEntries();
    isInitialized = true;
  });
</script>

{#if isInitialized}
  <div class="container">
    <Button
      variant="Outlined"
      width={boxSize}
      height={boxSize}
      fontSize="20px"
      onClick={() => {
        isEntryModalOpen = true;
        modal = {
          title: "",
          content: "",
          date: "",
          isCreate: true,
        };
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
          modal = {
            id: e.id,
            title: e.title,
            content: e.content,
            date: e.date,
            isCreate: false,
          };
        }}
      >
        <div
          class="flex entry"
          style:width={`calc(${boxSize} - 25px)`}
          style:height={boxSize}
        >
          <p style:font-weight="600" style:color={$themeStore.palette.primary}>
            {e.title}
          </p>
          <!-- style:text-align="justify"-->
          <p style:line-height="1.5">{e.content}</p>
          <p
            class="created-time"
            style:color={$themeMode === "light" ? "#ccc" : "#555"}
          >
            {formatDate(e.date)}
          </p>
        </div>
      </Button>
    {/each}
    <Modal bind:isOpen={isEntryModalOpen} width="400px">
      <div
        style:width="100%"
        style:display="flex"
        style:justify-content="center"
      >
        <p
          style:font-size="24px"
          style:font-weight="600"
          style:margin-bottom="14px"
        >
          {#if modal.isCreate}Create{:else}Modify{/if} Entry
        </p>
      </div>
      <TextField
        bind:value={modal.date}
        width="100%"
        type="date"
        label="Date"
        required
      />
      <div style:margin-top="9px">
        <TextField
          bind:value={modal.title}
          width="100%"
          label="Title"
          required
        />
      </div>
      <div style:margin-top="9px">
        <TextArea bind:value={modal.content} width="100%" label="Content" />
      </div>
      {#if modal.isCreate}
        <Button onClick={addEntry} marginTop="9px" width="100%">
          <Save size="23px" fill={$themeStore.palette.text.contrast} />
          <span style:margin-left="8px">SAVE ENTRY</span>
        </Button>
      {:else}
        <div
          style:width="100%"
          style:display="flex"
          style:justify-content="center"
        >
          <Button
            variant="Text"
            marginTop="6px"
            width="100px"
            height="25px"
            padding="0"
            onClick={() => {
              isEntryModalOpen = false;
              isDetailsModalOpen = true;
            }}
          >
            Check Details
          </Button>
        </div>
        <Button
          onClick={() => {
            updateEntry();
          }}
          marginTop="6px"
          width="100%"
        >
          <Pen size="23px" fill={$themeStore.palette.text.contrast} />
          <span style:margin-left="8px">MODIFY ENTRY</span>
        </Button>
        <Button
          variant="Outlined"
          borderColor="#f50d0d"
          color="#f50d0d"
          marginTop="9px"
          bgColorHover="rgba(255,0,0,0.12)"
          width="100%"
          onClick={() => {
            isEntryModalOpen = false;
            isDeleteModalOpen = true;
          }}
        >
          <Delete fill="#f50d0d" size="25px" />
          <span style:margin-left="5px">DELETE ENTRY</span>
        </Button>
      {/if}
    </Modal>

    <Modal bind:isOpen={isDeleteModalOpen} width="auto">
      <div class="center modal-blocks">
        <p class="modal-header">Delete Entry</p>
        <p style:margin-bottom="5px">
          Are you sure you want to delete this entry?
        </p>
      </div>
      <div class="center" style:gap="7px">
        <Button
          variant="Text"
          borderColor="#f50d0d"
          color="#f50d0d"
          bgColorHover="rgba(255,0,0,0.12)"
          width="100px"
          onClick={() => {
            deleteEntry();
            isDeleteModalOpen = false;
          }}
        >
          <span style:margin-left="px">YES</span>
        </Button>
        <Button
          variant="Text"
          width="100px"
          onClick={() => {
            isEntryModalOpen = true;
            isDeleteModalOpen = false;
          }}
        >
          <span style:width="30px">NO</span>
        </Button>
      </div>
    </Modal>
    <Modal bind:isOpen={isDetailsModalOpen} width="auto">
      <div class="center modal-blocks">
        <p class="modal-header">Details Entry</p>
        <ScrollbarContainer height="auto" maxHeight="500px" width="500px">
          <div style:line-height="1.38">
            {#each details as detail}
              <p>{detail.content}</p>
            {/each}
          </div>
        </ScrollbarContainer>
      </div>
      <div class="center" style:gap="7px">
        <Button
          variant="Text"
          width="140px"
          onClick={() => {
            isEntryModalOpen = true;
            isDetailsModalOpen = false;
          }}
        >
          <span>Back to the Entry</span>
        </Button>
      </div>
    </Modal>
  </div>
{/if}

<style>
  .center {
    width: 100%;
    display: flex;
    justify-content: center;
  }

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

  .modal-header {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 5px;
  }

  .create-button {
    align-items: center;
    gap: 12px;
    padding: 15px;
  }

  .modal-blocks {
    flex-direction: column;
    text-align: center;
  }
</style>
