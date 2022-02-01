import initSqlJs, { Database } from "sql.js";

const chinhookExample = "example_data/chinhook.sqlite";
const northwindExample = "example_data/northwind.sqlite";

export const enum SampleDatabases {
  chinhook = "example_data/chinhook.sqlite",
  northwind = "example_data/northwind.sqlite",
}

export default async function getDb(
  sampleDataPath: SampleDatabases
): Promise<Database> {
  const sqlPromise = initSqlJs({
    // Funktioniert immer:
    // locateFile: (file) => `https://sql.js.org/dist/${file}`,
    locateFile: (file) => `sql.js_asm_dist/${file}`,
  });
  const dataPromise = fetch(sampleDataPath).then((res) => res.arrayBuffer());
  const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);

  return new SQL.Database(new Uint8Array(buf));
}
