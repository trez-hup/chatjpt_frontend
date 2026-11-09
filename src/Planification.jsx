import { useState } from "react";
import {
  ArrowUp,
  BookOpen,
  CalendarClock,
  ChevronDown,
  Filter,
  Mail,
  MapPin,
  Mic,
  Music2,
  Newspaper,
  Tag,
} from "lucide-react";

const recommendations = [
  {
    title: "Dernières actualités",
    description:
      "Envoie-moi chaque jour un résumé de l’actualité sur les sujets qui m’intéressent.",
    icon: Newspaper,
  },
  {
    title: "Surveiller les e-mails",
    description:
      "Analyse mes e-mails et signale-moi tout ce qui nécessite mon attention.",
    icon: Mail,
  },
  {
    title: "Trouver des lectures pour le week-end",
    description: "Envoie-moi chaque samedi un excellent article à lire.",
    icon: BookOpen,
  },
  {
    title: "Alertes de prix",
    description:
      "Vérifie les prix chaque jour et préviens-moi quand mon article coûte moins cher.",
    icon: Tag,
  },
  {
    title: "Trouver des concerts",
    description:
      "Recherche chaque semaine de nouveaux concerts qui correspondent à mes goûts.",
    icon: Music2,
  },
  {
    title: "Planifier mon week-end",
    description:
      "Chaque jeudi, envoie-moi des idées d’activités à faire près de chez moi le week-end.",
    icon: MapPin,
  },
];

export default function Planification() {
  const [prompt, setPrompt] = useState("");
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [taskFilter, setTaskFilter] = useState("active");
  const [showRecommendations, setShowRecommendations] = useState(true);

  const visibleTasks = scheduledTasks.filter((task) =>
    taskFilter === "active" ? task.active : true,
  );

  function addTask(text) {
    const title = text.trim();
    if (!title) return;

    setScheduledTasks((currentTasks) => [
      { id: `${Date.now()}-${currentTasks.length}`, title, active: true },
      ...currentTasks,
    ]);
    setPrompt("");
  }

  function toggleTask(taskId) {
    setScheduledTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, active: !task.active } : task,
      ),
    );
  }

  return (
    <main className="schedule-page">
      <div className="schedule-content">
        <header className="schedule-header">
          <div>
            <h1>Planifié</h1>
            <p>
              Demandez à ChatGPT de planifier des tâches, de définir des rappels
              ou de surveiller les mises à jour.
            </p>
          </div>
          <div className="schedule-filter-wrap">
            <button
              type="button"
              className="schedule-status-filter"
              aria-expanded={showFilter}
              onClick={() => setShowFilter((open) => !open)}
            >
              <Filter size={14} />
              {taskFilter === "active" ? "Actif" : "Tous"}
              <ChevronDown size={13} />
            </button>
            {showFilter && (
              <div className="schedule-filter-menu">
                <button
                  type="button"
                  onClick={() => {
                    setTaskFilter("active");
                    setShowFilter(false);
                  }}
                >
                  Actifs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTaskFilter("all");
                    setShowFilter(false);
                  }}
                >
                  Tous
                </button>
              </div>
            )}
          </div>
        </header>

        <form
          className="schedule-prompt"
          onSubmit={(event) => {
            event.preventDefault();
            addTask(prompt);
          }}
        >
          <span className="schedule-prompt-plus" aria-hidden="true">
            +
          </span>
          <input
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Planifier une tâche"
            aria-label="Planifier une tâche"
          />
          <button
            type="button"
            className="schedule-mic-button"
            aria-label="Saisie vocale"
            title="Saisie vocale"
            disabled
          >
            <Mic size={17} />
          </button>
          <button
            type="submit"
            className="schedule-submit"
            aria-label="Ajouter la tâche planifiée"
            disabled={!prompt.trim()}
          >
            <ArrowUp size={19} />
          </button>
        </form>

        {visibleTasks.length > 0 && (
          <section className="scheduled-tasks">
            <h2>Vos tâches</h2>
            <ul>
              {visibleTasks.map((task) => (
                <li key={task.id}>
                  <CalendarClock size={17} />
                  <span>{task.title}</span>
                  <button
                    type="button"
                    className={task.active ? "task-active" : ""}
                    onClick={() => toggleTask(task.id)}
                  >
                    {task.active ? "Actif" : "En pause"}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="schedule-recommendations">
          <button
            type="button"
            className="schedule-recommendations-heading"
            aria-expanded={showRecommendations}
            onClick={() => setShowRecommendations((visible) => !visible)}
          >
            Recommandé
            <ChevronDown
              size={14}
              className={showRecommendations ? "" : "is-collapsed"}
            />
          </button>
          {showRecommendations && (
            <ul>
              {recommendations.map((recommendation) => {
                const Icon = recommendation.icon;
                const isAdded = scheduledTasks.some(
                  (task) => task.title === recommendation.title,
                );

                return (
                  <li key={recommendation.title}>
                    <Icon
                      className="schedule-recommendation-icon"
                      size={18}
                      aria-hidden="true"
                    />
                    <div className="schedule-recommendation-copy">
                      <h3>{recommendation.title}</h3>
                      <p>{recommendation.description}</p>
                    </div>
                    <button
                      type="button"
                      className="schedule-recommendation-add"
                      aria-label={
                        isAdded
                          ? `${recommendation.title} ajoutée`
                          : `Ajouter ${recommendation.title}`
                      }
                      title={isAdded ? "Ajoutée" : "Ajouter"}
                      disabled={isAdded}
                      onClick={() => addTask(recommendation.title)}
                    >
                      {isAdded ? "✓" : "+"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
