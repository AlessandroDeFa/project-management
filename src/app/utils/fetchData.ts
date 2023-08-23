export async function getTasks() {
  const res = await fetch("/api/get-tasks");
  if (!res.ok) {
    throw new Error("Errore durante la richiesta API");
  }
  return res.json();
}

export async function getNote() {
  const res = await fetch("/api/get-note");
  if (!res.ok) {
    throw new Error("Errore durante la richiesta API");
  }
  return res.json();
}

export async function getMemo() {
  const res = await fetch("/api/get-memo");
  if (!res.ok) {
    throw new Error("Errore durante la richiesta API");
  }
  return res.json();
}

export async function getProjects() {
  const res = await fetch("/api/get-projects");
  if (!res.ok) {
    throw new Error("Errore durante la richiesta API");
  }
  return res.json();
}

export async function getCompleted() {
  const res = await fetch("/api/get-completed");
  if (!res.ok) {
    throw new Error("Errore durante la richiesta API");
  }
  return res.json();
}

export async function getCounts() {
  const res = await fetch("/api/get-counts");
  if (!res.ok) {
    throw new Error("Errore durante la richiesta API");
  }
  return res.json();
}
