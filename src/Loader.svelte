<script lang="ts">
  import App from "./App.svelte";

  import getDb, { SampleDatabases } from "./getDb";

  const futureDb = getDb(SampleDatabases.northwind);
</script>

{#await futureDb}
  <!-- Warten für datenbank -->
  <p>waiting</p>
{:then db}
  <!-- Datenbank geladen, übergeben der datenbank (db) an 'App' -->
  <App {db} />
{:catch error}
  <!-- Datenbank konnte nicht geladen werden -->
  error loading the database: {error.message}
{/await}
