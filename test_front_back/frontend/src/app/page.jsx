/*
async function fetchTest() {
  const date = "today";
  const period = "1d";
  const url = `http://127.0.0.1:5000/vital_data/today/1d`;//http://127.0.0.1:5000/vital_data/today/1d
  const staticData = await fetch(url);
  return staticData.json();
}



/*
async function fetchTest(date = "today", period = "1d") {
  const response = await fetch(`http://127.0.0.1:5000/vital_data/${date}/${period}`);
  return response.json();
}



async function fetchTest(date = "today", period = "1d") {
  const url = `http://127.0.0.1:5000/vital_data/${date}/${period}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null; // エラーが発生した場合にnullを返す
  }
}

export default function Home() {
  return <h1>Hello World</h1>
}
*/

async function fetchTest(date = "today", period = "1d") {
  const response = await fetch(`http://127.0.0.1:5000/vital_data/${date}/${period}`);
  return response.json();
}

export default async function Page(date = "today", period = "1d") {
    const response = await fetchTest();
    if (!response) {
        return <div>Loading...</div>;
    }
    return <pre>{JSON.stringify(response, null, 2)}</pre>
}


