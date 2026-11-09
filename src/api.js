const API_URL = 'http://localhost:3001/api'

export async function getConversations() {
  const response = await fetch(`${API_URL}/conversations`)

  if (!response.ok) {
    throw new Error('Impossible de récupérer les conversations.')
  }

  return response.json()
}

export async function createConversation() {
  const response = await fetch(`${API_URL}/conversations`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Impossible de créer une conversation.')
  }

  return response.json()
}

export async function getMessages(conversationId) {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
  )

  if (!response.ok) {
    throw new Error('Impossible de récupérer les messages.')
  }

  return response.json()
}

export async function sendMessage(conversationId, content) {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    },
  )

  if (!response.ok) {
    throw new Error("Impossible d'envoyer le message.")
  }

  return response.json()
}

export async function deleteConversation(conversationId) {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}`,
    {
      method: "DELETE",
    },
  )

  if (!response.ok) {
    throw new Error("Impossible de supprimer la conversation.")
  }
}

export async function renameConversation(conversationId, title) {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    },
  )

  if (!response.ok) {
    throw new Error("Impossible de renommer la conversation.")
  }

  return response.json()
}