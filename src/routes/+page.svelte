<script lang="ts">
  import { onMount } from "svelte";
  import { entries, details } from "../stores/diaryStore";
  import { SqLiteProvider } from "$lib/SQLiteProvider";
  import {
    TextField,
    TextArea,
    Button,
    Modal,
    ScrollbarContainer,
    IconHover,
  } from "svelte-elegant";
  import { themeStore, themeMode } from "svelte-elegant/stores";
  import { Pen, Delete, Save, Plus } from "svelte-elegant/icons-elegant";
  let isEntryModalOpen = false;
  let isDeleteModalOpen = false;
  let isDetailModalOpen = false;
  let isDetailsModalOpen = false;
  let isDeleteDetailOpen = false;
  let detail = { id: 0, entry_id: 0, content: "" };
  let isInitialized = false;
  let boxSize = "220px";

  let sqLiteProvider = new SqLiteProvider();

  let modal = {
    id: 0,
    title: "",
    content: "",
    date: "",
    isCreate: false,
  };

  async function addDetail() {
    console.log(detail.content);
    await fetch("/api/details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entry_id: modal.id,
        content: detail.content,
      }),
    });
    sqLiteProvider.details.loadDetails(modal.id);
  }

  async function updateDetail(detail) {
    await fetch("/api/details", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: detail.id,
        entry_id: detail.entry_id,
        content: detail.content,
      }),
    });
    sqLiteProvider.details.loadDetails(modal.id);
  }

  async function deleteDetail(id) {
    await fetch("/api/details", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
      }),
    });
    sqLiteProvider.details.loadDetails(modal.id);
  }

  async function addEntry(entry) {
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: entry.date,
        title: entry.title,
        content: entry.content,
      }),
    });
    sqLiteProvider.entries.loadEntries();
    isEntryModalOpen = false;
  }

  async function updateEntry(entry) {
    await fetch("/api/entries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: entry.date,
        title: entry.title,
        content: entry.content,
        id: entry.id,
      }),
    });
    sqLiteProvider.entries.loadEntries();
    isEntryModalOpen = false;
  }

  async function deleteEntry(id) {
    await fetch("/api/entries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
      }),
    });
    sqLiteProvider.entries.loadEntries();
    isEntryModalOpen = false;
  }

  function formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("ru-RU", {
        weekday: "short", // 'Fri' вместо 'Friday'
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {}
  }

  onMount(() => {
    sqLiteProvider.entries.loadEntries();
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
          id: 0,
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
    {#each $entries as e}
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
          sqLiteProvider.details.loadDetails(modal.id);
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
        <Button
          onClick={() => {
            addEntry(modal);
          }}
          marginTop="9px"
          width="100%"
        >
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
              sqLiteProvider.details.loadDetails(modal.id);
            }}
          >
            Check Details
          </Button>
        </div>
        <Button
          onClick={() => {
            updateEntry(modal);
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
            deleteEntry(modal.id);
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

    <Modal bind:isOpen={isDetailsModalOpen} width="">
      <div class="center modal-blocks">
        <p class="modal-header">Details Entry</p>
        <ScrollbarContainer height="auto" maxHeight="500px">
          <div
            style:margin-bottom={$details.length ? "4px" : ""}
            style:font-size="16px"
            class="center flex"
          >
            {#each $details as det, i}
              <div
                style:width="100%"
                style:display="flex"
                style:margin-left="20px"
              >
                <p
                  style:margin-right="5px"
                  style:margin-top="4px"
                  style:text-align="justify"
                  style:line-height="1.5"
                >
                  {i + 1}. {det.content}
                </p>
                <div
                  style:margin-left="auto"
                  style:display="flex"
                  style:margin-top="5px"
                >
                  <IconHover
                    height="27px"
                    width="27px"
                    isPrimary
                    onClick={() => {
                      detail = {
                        id: det.id,
                        entry_id: det.entry_id,
                        content: det.content,
                      };
                      isDetailModalOpen = true;
                      isDetailsModalOpen = false;
                    }}
                  >
                    <Pen size="18px" />
                  </IconHover>
                  <IconHover
                    height="27px"
                    width="27px"
                    onClick={() => {
                      detail = {
                        id: det.id,
                        entry_id: det.entry_id,
                        content: det.content,
                      };

                      isDeleteDetailOpen = true;
                      isDetailsModalOpen = false;
                    }}
                  >
                    <Delete size="19px" />
                  </IconHover>
                </div>
              </div>
            {/each}
          </div>
        </ScrollbarContainer>
      </div>
      <div class="flex center" style:width="100%" style:gap="7px">
        <Button
          width="100%"
          maxWidth="340px"
          height="40px"
          onClick={() => {
            isDetailModalOpen = true;
            isDetailsModalOpen = false;
            detail = { id: 0, entry_id: modal.id, content: "" };
          }}
        >
          <Plus fill={$themeStore.palette.text.contrast} />
          <span style:margin-left="-6px">ADD DETAIL</span>
        </Button>
        <Button
          variant="Text"
          height="32px"
          width="128px"
          padding="0"
          onClick={() => {
            isEntryModalOpen = true;
            isDetailsModalOpen = false;
          }}
        >
          <span>Back to the Entry</span>
        </Button>
      </div>
    </Modal>

    <Modal bind:isOpen={isDetailModalOpen} width="400px">
      <div class="center modal-blocks">
        <p class="modal-header">
          {#if detail.id === 0}Create{:else}Moify{/if} Detail
        </p>
      </div>
      <div class="flex center" style:width="100%" style:gap="7px">
        <TextArea bind:value={detail.content} label="Detail" width="100%" />
        <Button
          width="100%"
          onClick={() => {
            isDetailModalOpen = false;
            isDetailsModalOpen = true;
            if (detail.id === 0) addDetail();
            else updateDetail(detail);
          }}
        >
          <Save size="23px" fill={$themeStore.palette.text.contrast} />
          <span style:margin-left="5px">SAVE DETAIL</span>
        </Button>
        <Button
          variant="Text"
          width="160px"
          onClick={() => {
            isDetailModalOpen = false;
            isDetailsModalOpen = true;
          }}
        >
          <span>Back to the Details</span>
        </Button>
      </div>
    </Modal>

    <Modal bind:isOpen={isDeleteDetailOpen} width="270px">
      <div class="center modal-blocks">
        <p class="modal-header">Delete Detail</p>
        <p style:margin-bottom="5px">
          Are you sure you want to delete this detail?
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
            deleteDetail(detail.id);
            isDetailsModalOpen = true;
            isDeleteDetailOpen = false;
          }}
        >
          <span style:margin-left="px">YES</span>
        </Button>
        <Button
          variant="Text"
          width="100px"
          onClick={() => {
            isDetailsModalOpen = true;
            isDeleteDetailOpen = false;
          }}
        >
          <span style:width="30px">NO</span>
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
    align-items: center;
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
