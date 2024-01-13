/*
async function fetchTest() {
    const date = "today";
  //const date = "2024-01-10";
    const period = "1d";
    const staticData = await fetch(`http://127.0.0.1:5000/vital_data/today/1d`);
    return staticData.json();
  }

  export default async function Page() {
    const stores = await fetchTest();
    return <pre>{JSON.stringify(stores, null, 2)}</pre>
  }

async function fetchTest(date = "today", period = "1d") {
  const response = await fetch(`http://127.0.0.1:5000/vital_data/${date}/${period}`);
  return response.json();
}

export default async function Page() {
    const stores = await fetchTest();
    if (!stores) {
        return <div>Loading...</div>;
    }
    return <pre>{JSON.stringify(stores, null, 2)}</pre>
}
*/