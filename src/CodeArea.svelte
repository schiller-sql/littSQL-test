<script lang="ts">
  export let value: string;

  import { onMount } from "svelte";
  let ace;
  let AceEditor;

  onMount(async () => {
    ace = await import("brace");
    import("brace/mode/sql");
    import("brace/theme/monokai");
    AceEditor = (await import("svelte-ace")).AceEditor;
  });
</script>

<div style="padding-left: 15%; padding-right: 15%">
  <svelte:component
    this={AceEditor}
    height="300px"
    lang="sql"
    theme="monokai"
    bind:value
  />
</div>
