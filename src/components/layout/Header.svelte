<script>
  import { ColorThemeSwitch, Header, LangSelector } from "svelte-elegant";
  import { themeStore } from "svelte-elegant/stores";
  import { Diary } from "svelte-elegant/icons-elegant";

  let lg = "en";
  let theme;

  // Подписываемся на изменения темы
  themeStore.subscribe((value) => {
    theme = value;
  });

  //Styles
  $: primary = theme?.palette.primary;
</script>

<Header {...$$props}>
  <a href="/home" style:text-decoration="none">
    <button>
      <Diary />
      <p class="logo-p">
        <span style:color={primary}> WEB </span>
        <span style:color={$themeStore.palette.text.main}> Diary </span>
      </p>
    </button>
  </a>
  <div
    style:display="flex"
    style:align-items="center"
    style:margin-left="auto"
    style:margin-right="0.25rem"
  >
    <ColorThemeSwitch />
  </div>
</Header>

<style>
  .logo-p {
    margin-left: 0.25rem;
    font-size: 26px;
  }

  .logo:hover {
    transform: scale(1.2);
  }
</style>
