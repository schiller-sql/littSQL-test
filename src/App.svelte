<script lang="ts">
  import DataTable, { Row, Cell, Body, Head } from "@smui/data-table";
  import Button from "@smui/button";
  import CodeArea from "./CodeArea.svelte";
  import type { Database, QueryExecResult, SqlValue } from "sql.js";
  export let db: Database;

  let query: string;
  let queryOutput:
    | undefined
    | {
        type: "error";
        message: string;
      }
    | { type: "no_output" }
    | { type: "output"; data: QueryExecResult };

  function runQuery() {
    if (query === "") return;

    try {
      const res = db.exec(query);
      if (res.length === 0) {
        queryOutput = { type: "no_output" };
      } else if (res.length > 1) {
        queryOutput = { type: "error", message: "too many outputs" };
      } else {
        queryOutput = { type: "output", data: res[0] };
      }
    } catch (e) {
      queryOutput = { type: "error", message: e.message };
    }
  }

  // function colorFromValue(value: SqlValue) {
  // if(value instanceof string) {
  // }
  // }
</script>

<main>
  <div style="padding-bottom:24px" class="mdc-typography--headline1">
    littSQL
  </div>
  <CodeArea bind:value={query} />

  <Button on:click={runQuery}>Execute query</Button>

  {#if queryOutput}
    {#if queryOutput.type === "no_output"}
      <p>Keine Reihen wurde zurückgegeben</p>
    {:else if queryOutput.type === "error"}
      <p style="color: red;">{queryOutput.message}</p>
    {:else}
      <DataTable>
        <Head>
          <Row>
            {#each queryOutput.data.columns as columnName}
              <Cell>{columnName}</Cell>
            {/each}
          </Row>
        </Head>
        <Body>
          {#each queryOutput.data.values as row}
            <Row>
              {#each row as value}
                <Cell
                  ><div style="color: {value === null ? 'gray' : 'black'};">
                    {value}
                  </div></Cell
                >
              {/each}
            </Row>
          {/each}
        </Body>
      </DataTable>
    {/if}
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
