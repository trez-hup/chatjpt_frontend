import { useMemo, useState } from "react";
import { Check, Plus, Search, Settings2 } from "lucide-react";

const pluginGroups = [
  {
    title: "Les plus utilisés",
    plugins: [
      { name: "Gmail", description: "Lire et envoyer des e-mails", icon: "M", color: "#ea4335" },
      { name: "Google Drive", description: "Rechercher dans vos fichiers", icon: "△", color: "#34a853" },
      { name: "Health", description: "Explorer votre santé et votre bien-être", icon: "♥", color: "#ef4444" },
      { name: "GitHub", description: "Gérer vos dépôts et vos pull requests", icon: "⌘", color: "#f5f5f5" },
      { name: "Remote Desktop Commander", description: "Utiliser votre ordinateur à distance", icon: "▣", color: "#a78bfa" },
      { name: "Supabase", description: "Gérer vos données et bases de données", icon: "ϟ", color: "#22c55e" },
    ],
  },
  {
    title: "Nouveautés à découvrir",
    plugins: [
      { name: "iCloud Mail", description: "Lire et gérer vos e-mails iCloud", icon: "☁", color: "#38bdf8" },
      { name: "iCloud Calendar", description: "Lire et gérer vos événements", icon: "▦", color: "#f87171" },
      { name: "Tripy", description: "Planifier et organiser vos voyages", icon: "✈", color: "#fb923c" },
      { name: "Sonos", description: "Contrôler votre système Sonos", icon: "S", color: "#d4d4d4" },
      { name: "Revy", description: "Obtenir des conseils et des idées", icon: "✦", color: "#a3e635" },
      { name: "Adobe", description: "Concevoir, combiner et éditer", icon: "A", color: "#ef4444" },
    ],
  },
  {
    title: "Productivité",
    plugins: [
      { name: "Notion", description: "Créer des notes, tâches et bases de données", icon: "N", color: "#f5f5f5" },
      { name: "Google Calendar", description: "Gérer votre agenda Google", icon: "▦", color: "#60a5fa" },
      { name: "Dropbox", description: "Trouver et partager vos fichiers", icon: "◆", color: "#3b82f6" },
      { name: "Asana", description: "Organiser et suivre vos projets", icon: "●", color: "#fb7185" },
      { name: "Outlook Calendar", description: "Gérer votre calendrier Outlook", icon: "▣", color: "#38bdf8" },
      { name: "Todoist", description: "Gérer vos tâches et rappels", icon: "☑", color: "#ef4444" },
    ],
  },
  {
    title: "Communication",
    plugins: [
      { name: "Outlook Email", description: "Gérer votre boîte de réception", icon: "O", color: "#60a5fa" },
      { name: "Slack", description: "Lire et gérer Slack", icon: "#", color: "#c084fc" },
      { name: "Zoom", description: "Organiser vos réunions vidéo", icon: "Z", color: "#3b82f6" },
      { name: "Teams", description: "Collaborer avec votre équipe", icon: "T", color: "#818cf8" },
    ],
  },
  {
    title: "Créativité",
    plugins: [
      { name: "Canva", description: "Créer des visuels et présentations", icon: "C", color: "#22d3ee" },
      { name: "Higgsfield", description: "Créer des images et vidéos", icon: "✳", color: "#a3e635" },
      { name: "Figma", description: "Créer des designs et prototypes", icon: "F", color: "#c084fc" },
      { name: "HeyGen", description: "Créer des vidéos avec des avatars", icon: "◇", color: "#22d3ee" },
    ],
  },
  {
    title: "Outils de développement",
    plugins: [
      { name: "Vercel", description: "Déployer et gérer vos applications", icon: "▲", color: "#f5f5f5" },
      { name: "Tingfish", description: "Trouver et compléter des tâches web", icon: "◉", color: "#fb923c" },
      { name: "Lovable", description: "Créer une application à partir d'une idée", icon: "♥", color: "#fb7185" },
      { name: "Eza", description: "Rechercher des outils pour développeurs", icon: "E", color: "#60a5fa" },
      { name: "WPVibe", description: "Gérer vos outils WordPress", icon: "W", color: "#38bdf8" },
      { name: "Base44", description: "Créer des applications avec l'IA", icon: "◉", color: "#fb923c" },
    ],
  },
  {
    title: "Finance",
    plugins: [
      { name: "Stripe", description: "Suivre paiements et revenus", icon: "S", color: "#818cf8" },
      { name: "Public Equity Investing", description: "Suivre les marchés publics", icon: "▥", color: "#4ade80" },
      { name: "Finance", description: "Explorer les données financières", icon: "$", color: "#facc15" },
      { name: "Bigdata.com", description: "Explorer des données de marché", icon: "◈", color: "#d4d4d4" },
    ],
  },
  {
    title: "Voyage",
    plugins: [
      { name: "Booking.com", description: "Trouver des hôtels et séjours", icon: "▣", color: "#60a5fa" },
      { name: "Skyscanner", description: "Comparer et trouver des vols", icon: "✈", color: "#38bdf8" },
      { name: "Tripadvisor", description: "Trouver des activités et hôtels", icon: "◉", color: "#4ade80" },
      { name: "Wanderlog", description: "Organiser votre prochain voyage", icon: "✦", color: "#facc15" },
    ],
  },
  {
    title: "Éducation et recherche",
    plugins: [
      { name: "Consensus", description: "Rechercher dans les publications scientifiques", icon: "C", color: "#22d3ee" },
      { name: "SciSpace", description: "Explorer les articles de recherche", icon: "◈", color: "#38bdf8" },
      { name: "Zotero", description: "Gérer vos références et citations", icon: "Z", color: "#fb7185" },
      { name: "Life Sciences Literature", description: "Trouver des publications scientifiques", icon: "▤", color: "#60a5fa" },
    ],
  },
];

const initialInstalled = [
  { name: "ChatGPT", description: "Votre assistant IA", icon: "✳", color: "#f5f5f5" },
];

function PluginIcon({ plugin }) {
  return (
    <span
      className="plugin-icon"
      style={{ "--plugin-color": plugin.color }}
      aria-hidden="true"
    >
      {plugin.icon}
    </span>
  );
}

function PluginCard({ plugin, installed, onToggle }) {
  return (
    <article className="plugin-card">
      <PluginIcon plugin={plugin} />
      <div className="plugin-card-copy">
        <h3>{plugin.name.trim()}</h3>
        <p>{plugin.description}</p>
      </div>
      <button
        className={`plugin-add-button${installed ? " is-installed" : ""}`}
        type="button"
        onClick={() => onToggle(plugin)}
        aria-label={installed ? `Désinstaller ${plugin.name.trim()}` : `Ajouter ${plugin.name.trim()}`}
        title={installed ? "Désinstaller" : "Ajouter"}
      >
        {installed ? <Check size={17} /> : <Plus size={17} />}
      </button>
    </article>
  );
}

export default function Plugins() {
  const [query, setQuery] = useState("");
  const [installed, setInstalled] = useState(initialInstalled);
  const [activeTab, setActiveTab] = useState("plugins");
  const normalizedQuery = query.trim().toLocaleLowerCase("fr");

  const visibleGroups = useMemo(
    () =>
      pluginGroups
        .map((group) => ({
          ...group,
          plugins: group.plugins.filter((plugin) =>
            `${plugin.name} ${plugin.description} ${group.title}`
              .toLocaleLowerCase("fr")
              .includes(normalizedQuery),
          ),
        }))
        .filter((group) => group.plugins.length > 0),
    [normalizedQuery],
  );

  const visibleInstalled = installed.filter((plugin) =>
    `${plugin.name} ${plugin.description}`
      .toLocaleLowerCase("fr")
      .includes(normalizedQuery),
  );

  function togglePlugin(plugin) {
    setInstalled((current) =>
      current.some((item) => item.name === plugin.name)
        ? current.filter((item) => item.name !== plugin.name)
        : [...current, plugin],
    );
  }

  return (
    <main className="plugins-page">
      <header className="plugins-topbar">
        <nav className="plugins-tabs" aria-label="Navigation des extensions">
          <button
            type="button"
            className={`plugins-tab${activeTab === "plugins" ? " active" : ""}`}
            aria-pressed={activeTab === "plugins"}
            onClick={() => setActiveTab("plugins")}
          >
            Plugins
          </button>
          <button
            type="button"
            className={`plugins-tab${activeTab === "skills" ? " active" : ""}`}
            aria-pressed={activeTab === "skills"}
            onClick={() => setActiveTab("skills")}
          >
            Skills
          </button>
        </nav>
        {activeTab === "plugins" && (
          <>
            <button className="plugins-settings" type="button" aria-label="Paramètres des plugins">
              <Settings2 size={17} />
            </button>
            <button className="plugins-add-custom" type="button">
              Ajouter <span aria-hidden="true">⌄</span>
            </button>
          </>
        )}
      </header>

      {activeTab === "skills" ? (
        <div className="skills-content">
          <section className="skills-intro">
            <h1>Skills</h1>
            <p>Des instructions qui étendent les fonctionnalités de ChatGPT.</p>
          </section>

          <label className="plugin-search skills-search">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher des Skills"
              aria-label="Rechercher des Skills"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Effacer la recherche">
                ×
              </button>
            )}
          </label>

          <p className="skills-unavailable">
            Les Skills ne sont pas disponibles pour ce compte
          </p>
        </div>
      ) : (
        <div className="plugins-content">
          <section className="plugins-intro">
            <h1>Plugins</h1>
            <p>Connectez des plugins pour permettre à ChatGPT de travailler avec vos outils.</p>
          </section>

          <label className="plugin-search">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher des plugins"
              aria-label="Rechercher des plugins"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Effacer la recherche">
                ×
              </button>
            )}
          </label>

          <section className="installed-section">
            <h2>Installés <span aria-hidden="true">›</span></h2>
            {visibleInstalled.length ? (
              <div className="installed-list">
                {visibleInstalled.map((plugin) => (
                  <div className="installed-plugin" key={plugin.name}>
                    <PluginIcon plugin={plugin} />
                    <span>{plugin.name}</span>
                    <span className="plugin-visibility">Public</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="plugins-empty">Aucun plugin installé ne correspond à cette recherche.</p>
            )}
          </section>

          {visibleGroups.length ? (
            visibleGroups.map((group) => (
              <section className="plugin-group" key={group.title}>
                <h2>{group.title} <span aria-hidden="true">›</span></h2>
                <div className="plugin-grid">
                  {group.plugins.map((plugin) => (
                    <PluginCard
                      key={plugin.name}
                      plugin={plugin}
                      installed={installed.some((item) => item.name === plugin.name)}
                      onToggle={togglePlugin}
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <p className="plugins-empty">Aucun plugin ne correspond à cette recherche.</p>
          )}
        </div>
      )}
    </main>
  );
}
