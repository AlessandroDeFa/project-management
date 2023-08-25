interface FormValues {
  name: string;
  note: string;
  projectFor?: string;
  isCompleted: boolean;
  dueDate?: string;
  elementType?: string;
}

export const submitTask = async ({
  name,
  note,
  projectFor,
  isCompleted,
}: FormValues) => {
  const taskData = {
    name: name,
    note: note,
    projectFor: projectFor,
    isCompleted: isCompleted,
  };

  const response = await fetch(
    "https://task-master-pm.vercel.app/api/create-task",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    }
  );
  if (!response.ok) {
    throw new Error("Errore durante la creazione del task");
  }

  return response.json();
};

export const submitNote = async ({
  name,
  note,
  projectFor,
  isCompleted,
}: FormValues) => {
  const noteData = {
    name: name,
    note: note,
    projectFor: projectFor,
    isCompleted: isCompleted,
  };

  const response = await fetch("http://localhost:3000/api/create-note", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteData),
  });
  if (!response.ok) {
    throw new Error("Errore durante la creazione degli appunti");
  }

  return response.json();
};
export const submitMemo = async ({
  name,
  note,
  isCompleted,
  dueDate,
}: FormValues) => {
  const memoData = {
    name: name,
    note: note,
    dueDate: dueDate,
    isCompleted: isCompleted,
  };

  const response = await fetch(
    "https://task-master-pm.vercel.app/api/create-memo",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memoData),
    }
  );
  if (!response.ok) {
    throw new Error("Errore durante la creazione del promemoria");
  }

  return response.json();
};
export const submitProject = async ({
  name,
  note,
  isCompleted,
}: FormValues) => {
  const projectData = {
    name: name,
    note: note,
    isCompleted: isCompleted,
  };

  const response = await fetch("http://localhost:3000/api/create-project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) {
    throw new Error("Errore durante la creazione del progetto");
  }

  return response.json();
};

export const submitCompleted = async ({
  name,
  note,
  projectFor,
  isCompleted,
  elementType,
}: FormValues) => {
  const completedElement = {
    name: name,
    note: note,
    projectFor: projectFor,
    isCompleted: isCompleted,
    elementType: elementType,
  };

  const response = await fetch(
    "https://task-master-pm.vercel.app/api/insert-completed",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(completedElement),
    }
  );
  if (!response.ok) {
    throw new Error(
      `Errore durante la completazione dell' elemento: ${elementType}`
    );
  }

  return response.json();
};

export const deleteAllCompletedElements = async () => {
  const response = await fetch(
    "https://task-master-pm.vercel.app/api/delete-all-completed",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Errore durante l' eliminazione degli elementi completati");
  }
};

export const deletedSelectedElement = async (id: string) => {
  const response = await fetch(
    "https://task-master-pm.vercel.app/api/delete-completed",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    }
  );
  if (!response.ok) {
    throw new Error("Errore durante l' eliminazione dell' elemento completato");
  }
};

export const moveToCompleted = async (id: string, elementType: string) => {
  const response = await fetch(
    "https://task-master-pm.vercel.app/api/move-to-completed",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, elementType }),
    }
  );
  if (!response.ok) {
    throw new Error("Errore durante la completazione dell' elemento");
  }
};

export const getResultsFromQuery = async (query: string) => {
  const response = await fetch(
    "https://task-master-pm.vercel.app/api/get-results-query",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );

  if (!response.ok) {
    throw new Error("Errore durante la ricerca");
  }

  return response.json();
};
