import { useEffect, useRef, useState } from "react";
import {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
  deleteConversation,
  renameConversation,
} from "./api";
import {
  BookOpen,
  CalendarClock,
  ChevronDown,
  Code2,
  Compass,
  Folder,
  FolderPlus,
  Image,
  Library,
  Lightbulb,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  Puzzle,
  Search,
  SendHorizontal,
  Sparkles,
  SquarePen,
  Trash2,
  Globe,
} from "lucide-react";
import Bibliotheque from "./Bibliotheque";
import Planification from "./Planification";
import Plugins from "./Plugins";

function App() {
  const [activePage, setActivePage] = useState("chat");
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState("");
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projects, setProjects] = useState([
    {
      id: "investissement",
      name: "Investissement",
      subtitle: "",
    },
  ]);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [isProjectsSectionOpen, setIsProjectsSectionOpen] = useState(true);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [projectMemory, setProjectMemory] = useState("default");
  const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isCreateProjectOpen) {
      return undefined;
    }

    function handleDialogKeyDown(event) {
      if (event.key === "Escape") {
        setIsCreateProjectOpen(false);
      }
    }

    window.addEventListener("keydown", handleDialogKeyDown);
    return () => window.removeEventListener("keydown", handleDialogKeyDown);
  }, [isCreateProjectOpen]);

  useEffect(() => {
    async function loadConversations() {
      try {
        const data = await getConversations();

        setConversations(data);
      } catch {
        setError("Impossible de joindre le backend.");
      }
    }

    loadConversations();
  }, []);

  async function handleNewConversation() {
    setActivePage("chat");
    setActiveConversationId(null);
    setMessages([]);
    setInput("");
    setError("");
  }

  async function handleSelectConversation(conversationId) {
    try {
      const data = await getMessages(conversationId);

      setActiveConversationId(conversationId);
      setMessages(data);
    } catch {
      setError("Impossible de récupérer les messages.");
    }
  }

  async function handleSendMessage(event) {
    event.preventDefault();

    const content = input.trim();

    if (!content || isSending) {
      return;
    }

    setIsSending(true);

    try {
      let conversationId = activeConversationId;

      if (conversationId === null) {
        const newConversation = await createConversation();

        setConversations((currentConversations) => [
          newConversation,
          ...currentConversations,
        ]);

        setActiveConversationId(newConversation.id);

        conversationId = newConversation.id;
      }

      const data = await sendMessage(conversationId, content);

      setMessages((currentMessages) => [
        ...currentMessages,
        data.userMessage,
        data.assistantMessage,
      ]);
      const updatedConversations = await getConversations();
      setConversations(updatedConversations);
      setInput("");
    } catch {
      setError("Impossible d'envoyer le message.");
    } finally {
      setIsSending(false);
    }
  }

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );

  const filteredConversations = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  function handleInputKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form.requestSubmit();
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isSending]);

  async function handleDeleteConversation(conversationId) {
    const shouldDelete = window.confirm(
      "Supprimer cette conversation et tous ses messages ?",
    );

    if (!shouldDelete) {
      return;
    }
    try {
      await deleteConversation(conversationId);

      setConversations((currentConversations) =>
        currentConversations.filter(
          (conversation) => conversation.id !== conversationId,
        ),
      );

      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setMessages([]);
      }
    } catch {
      setError("Impossible de supprimer la conversation.");
    }
  }

  async function handleRenameConversation(conversation) {
    const title = window.prompt(
      "Nouveau titre de la conversation :",
      conversation.title,
    );

    if (!title?.trim()) {
      return;
    }

    try {
      const updatedConversation = await renameConversation(
        conversation.id,
        title,
      );

      setConversations((currentConversations) =>
        currentConversations.map((currentConversation) =>
          currentConversation.id === updatedConversation.id
            ? updatedConversation
            : currentConversation,
        ),
      );
    } catch {
      setError("Impossible de renommer la conversation.");
    }
  }

  function handleResizeStart(event) {
    event.preventDefault();

    const startX = event.clientX;
    const startWidth = sidebarWidth;

    function handleMouseMove(moveEvent) {
      const difference = moveEvent.clientX - startX;
      const nextWidth = startWidth + difference;

      const minimumWidth = 220;
      const maximumWidth = 450;

      setSidebarWidth(
        Math.min(Math.max(nextWidth, minimumWidth), maximumWidth),
      );
    }

    function handleMouseUp() {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleSuggestionClick(text) {
    setInput(text);
  }

  function handleCreateProject(event) {
    event.preventDefault();
    const name = newProjectName.trim();

    if (!name) {
      return;
    }

    const project = {
      id: `project-${Date.now()}`,
      name,
      subtitle: "",
    };

    setProjects((currentProjects) => [...currentProjects, project]);
    setExpandedProjects((currentExpanded) => ({
      ...currentExpanded,
      [project.id]: true,
    }));
    setNewProjectName("");
    setProjectMemory("default");
    setIsCreateProjectOpen(false);
  }

  return (
    <div className="app-layout">
      <aside
        className={`sidebar ${isSidebarOpen ? "" : "sidebar-collapsed"}`}
        style={{ width: isSidebarOpen ? sidebarWidth : 56 }}
      >
        <div className="sidebar-header">
          <h1>Mon Chat IA</h1>
          <button
            type="button"
            className="search-icon"
            aria-label={isSearchOpen ? "Masquer la recherche" : "Rechercher"}
            aria-pressed={isSearchOpen}
            onClick={() => setIsSearchOpen((open) => !open)}
          >
            🔍
          </button>
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen((open) => !open)}
            aria-label={
              isSidebarOpen ? "Réduire la sidebar" : "Afficher la sidebar"
            }
          >
            {isSidebarOpen ? (
              <PanelLeftClose size={18} />
            ) : (
              <PanelLeftOpen size={18} />
            )}
          </button>
        </div>

        {isSearchOpen && (
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Rechercher une conversation"
            aria-label="Rechercher une conversation"
            autoFocus
          />
        )}

        <button
          className="sidebar-link"
          onClick={handleNewConversation}
          aria-label="Nouvelle conversation"
          title="Nouvelle conversation"
        >
          <SquarePen size={18} />
          <span>Nouvelle conversation</span>
        </button>
        <button className="sidebar-link" aria-label="Images" title="Images">
          <Image size={18} />
          <span>Images</span>
        </button>
        <button
          className={`sidebar-link${activePage === "library" ? " active-sidebar-link" : ""}`}
          aria-label="Bibliothèque"
          title="Bibliothèque"
          aria-current={activePage === "library" ? "page" : undefined}
          onClick={() => setActivePage("library")}
        >
          <Library size={18} />
          <span>Bibliothèque</span>
        </button>
        <button
          className={`sidebar-link${activePage === "schedule" ? " active-sidebar-link" : ""}`}
          aria-label="Planification"
          title="Planification"
          aria-current={activePage === "schedule" ? "page" : undefined}
          onClick={() => setActivePage("schedule")}
        >
          <CalendarClock size={18} />
          <span>Planification</span>
        </button>
        <button
          className={`sidebar-link${activePage === "plugins" ? " active-sidebar-link" : ""}`}
          aria-label="Plugins"
          title="Plugins"
          aria-current={activePage === "plugins" ? "page" : undefined}
          onClick={() => setActivePage("plugins")}
        >
          <Puzzle size={18} />
          <span>Plugins</span>
        </button>
        <button className="sidebar-link" aria-label="Codex" title="Codex">
          <Code2 size={18} />
          <span>Codex</span>
        </button>
        <button className="sidebar-link" aria-label="Explorer" title="Explorer">
          <Compass size={18} />
          <span>Explorer</span>
        </button>

        <section className="sidebar-projects">
          <div className="sidebar-projects-header">
            <button
              type="button"
              className="sidebar-projects-toggle"
              onClick={() => setIsProjectsSectionOpen((open) => !open)}
              aria-expanded={isProjectsSectionOpen}
            >
              <span>Projets</span>
              <ChevronDown
                size={13}
                className={isProjectsSectionOpen ? "" : "is-collapsed"}
              />
            </button>
            <div className="sidebar-project-actions">
              <button
                type="button"
                aria-label="Options des projets"
                title="Options des projets"
                onClick={() => setIsProjectsMenuOpen((open) => !open)}
              >
                <MoreHorizontal size={17} />
              </button>
              <button
                type="button"
                aria-label="Créer un projet"
                title="Créer un projet"
                onClick={() => {
                  setIsProjectsMenuOpen(false);
                  setIsCreateProjectOpen(true);
                }}
              >
                <Plus size={17} />
              </button>
            </div>
            {isProjectsMenuOpen && (
              <div className="sidebar-project-menu">
                <button
                  type="button"
                  onClick={() => {
                    setIsProjectsSectionOpen((open) => !open);
                    setIsProjectsMenuOpen(false);
                  }}
                >
                  {isProjectsSectionOpen
                    ? "Réduire la section"
                    : "Développer la section"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsProjectsMenuOpen(false);
                    setIsCreateProjectOpen(true);
                  }}
                >
                  Créer un projet
                </button>
              </div>
            )}
          </div>
          {isProjectsSectionOpen && (
            <ul className="sidebar-project-list">
              {projects.map((project) => (
                <li className="sidebar-project-item" key={project.id}>
                  <button
                    type="button"
                    className="sidebar-project-button"
                    onClick={() =>
                      setExpandedProjects((currentExpanded) => ({
                        ...currentExpanded,
                        [project.id]: !currentExpanded[project.id],
                      }))
                    }
                    aria-expanded={Boolean(expandedProjects[project.id])}
                  >
                    <Folder size={16} />
                    <span>{project.name}</span>
                  </button>
                  {expandedProjects[project.id] && project.subtitle && (
                    <button
                      type="button"
                      className="sidebar-project-subtitle"
                      title={project.subtitle}
                      onClick={() => setActivePage("chat")}
                    >
                      {project.subtitle}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <h2>Recents</h2>

        {error && <p>{error}</p>}

        {conversations.length === 0 ? (
          <p>Aucune conversation pour le moment.</p>
        ) : filteredConversations.length === 0 ? (
          <p>Aucune conversation ne correspond à cette recherche.</p>
        ) : (
          <ul className="conversation-list">
            {filteredConversations.map((conversation) => (
              <li key={conversation.id} className="conversation-item">
                <button
                  className={
                    conversation.id === activeConversationId
                      ? "active-conversation"
                      : ""
                  }
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  {conversation.title}
                </button>
                <button
                  onClick={() => handleDeleteConversation(conversation.id)}
                  type="button"
                  className="delete-button"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  type="button"
                  className="rename-button"
                  onClick={() => handleRenameConversation(conversation)}
                >
                  <Pencil size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
      {isSidebarOpen && (
        <div className="resize-handle" onMouseDown={handleResizeStart} />
      )}

      {isCreateProjectOpen && (
        <div
          className="project-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsCreateProjectOpen(false);
            }
          }}
        >
          <section
            className="project-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-project-title"
          >
            <header className="project-dialog-header">
              <h2 id="create-project-title">Créer un projet</h2>
              <button
                type="button"
                className="project-dialog-close"
                aria-label="Fermer"
                onClick={() => setIsCreateProjectOpen(false)}
              >
                ×
              </button>
            </header>
            <form onSubmit={handleCreateProject}>
              <label className="project-name-label" htmlFor="project-name">
                Nom du projet
              </label>
              <div className="project-name-field">
                <Folder size={17} />
                <input
                  id="project-name"
                  autoFocus
                  required
                  value={newProjectName}
                  onChange={(event) => setNewProjectName(event.target.value)}
                  placeholder="Voyage à Copenhague"
                />
              </div>
              <div className="project-dialog-tip">
                <Lightbulb size={18} />
                <p>
                  Les projets regroupent vos chats, fichiers et instructions
                  personnalisées au même endroit. Utilisez-les pour vos travaux
                  en cours ou simplement pour rester organisé.
                </p>
              </div>
              <footer className="project-dialog-footer">
                <label className="project-memory-select">
                  <span className="sr-only">Mémoire du projet</span>
                  <select
                    value={projectMemory}
                    onChange={(event) => setProjectMemory(event.target.value)}
                  >
                    <option value="default">Mémoire par défaut</option>
                    <option value="project-only">
                      Mémoire de ce projet uniquement
                    </option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="project-create-submit"
                  disabled={!newProjectName.trim()}
                >
                  Créer un projet
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {activePage === "library" ? (
        <Bibliotheque />
      ) : activePage === "schedule" ? (
        <Planification />
      ) : activePage === "plugins" ? (
        <Plugins />
      ) : (
        <main className="chat">
          <header className="topbar">
            <div className="topbar-left">
              {activeConversation && (
                <span className="conversation-name">
                  {activeConversation.title}
                </span>
              )}
            </div>

            <div className="mode-switcher">
              <button type="button" className="active-mode">
                Chat
              </button>

              <button type="button">✦ Outils</button>
            </div>

            <div className="topbar-actions">
              <button type="button">✦ Découvrir</button>

              <button type="button" aria-label="Actualiser">
                ↻
              </button>
            </div>
          </header>

          {activeConversationId === null ? (
            <section className="new-chat-screen">
              <div className="new-chat-content">
                <h2>Comment puis-je vous aider ?</h2>

                <form className="prompt-form" onSubmit={handleSendMessage}>
                  <button
                    type="button"
                    className="attach-button"
                    aria-label="Ajouter un fichier"
                  >
                    <Plus size={25} />
                  </button>

                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Poser une question"
                    rows={1}
                  />

                  <button type="button" className="analysis-button">
                    <Sparkles size={18} />
                    <span>Analyser</span>
                  </button>

                  <button
                    type="submit"
                    className="send-button"
                    disabled={isSending || !input.trim()}
                    aria-label="Envoyer"
                  >
                    {isSending ? "…" : <SendHorizontal size={21} />}
                  </button>
                </form>

                <div className="suggestion-list">
                  <button
                    type="button"
                    onClick={() =>
                      handleSuggestionClick(
                        "Créer une image d’un coucher de soleil",
                      )
                    }
                  >
                    <Image size={18} />
                    <span>Créer une image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSuggestionClick("Aide-moi à écrire un texte")
                    }
                  >
                    <SquarePen size={18} />
                    <span>Écrire ou modifier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSuggestionClick("Recherche des informations sur ")
                    }
                  >
                    <Globe size={18} />
                    <span>Rechercher sur le Web</span>
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <>
              <section className="messages">
                {messages.length === 0 ? (
                  <p>Cette conversation ne contient encore aucun message.</p>
                ) : (
                  <ul>
                    {messages.map((message) => (
                      <li
                        key={message.id}
                        className={`message ${message.role}`}
                      >
                        <strong>
                          {message.role === "user" ? "Toi" : "Assistant"} :
                        </strong>{" "}
                        {message.content}
                      </li>
                    ))}
                  </ul>
                )}

                {isSending && <p className="typing">L’assistant écrit...</p>}

                <div ref={messagesEndRef} />
              </section>

              <form className="chat-composer" onSubmit={handleSendMessage}>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Envoie un message..."
                  rows={1}
                />

                <button type="submit" disabled={isSending || !input.trim()}>
                  {isSending ? "Envoi..." : "Envoyer"}
                </button>
              </form>
            </>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
