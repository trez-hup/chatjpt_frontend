import { useState } from "react";
import {
  ChevronDown,
  Grid2X2,
  List,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const libraryTabs = ["Suggestions", "Favoris", "Dossiers", "Images", "Tout"];

const emptyStates = {
  Suggestions: {
    title: "Rien à suggérer pour le moment",
    description: "",
  },
  Favoris: {
    title: "Aucun favori pour le moment",
    description: "",
  },
  Dossiers: {
    title: "Créez votre premier dossier",
    description: "Créez des dossiers pour organiser les éléments de votre bibliothèque.",
  },
  Images: {
    title: "Aucune image pour le moment",
    description: "",
  },
  Tout: {
    title: "Votre bibliothèque est vide",
    description: "",
  },
};

export default function Bibliotheque() {
  const [activeTab, setActiveTab] = useState("Suggestions");
  const emptyState = emptyStates[activeTab];

  return (
    <main className="library-page">
      <div className="library-content">
        <header className="library-header">
          <h1>Bibliothèque</h1>
          <div className="library-toolbar">
            <button
              type="button"
              className="library-icon-button"
              aria-label="Filtrer la bibliothèque"
              disabled
            >
              <SlidersHorizontal size={17} />
            </button>
            <button
              type="button"
              className="library-icon-button selected"
              aria-label="Affichage en grille"
              aria-pressed="true"
              disabled
            >
              <Grid2X2 size={17} />
            </button>
            <button
              type="button"
              className="library-icon-button"
              aria-label="Affichage en liste"
              disabled
            >
              <List size={17} />
            </button>
            <label className="library-search">
              <Search size={16} aria-hidden="true" />
              <input
                type="search"
                placeholder="Chercher dans Bibliothèque"
                aria-label="Chercher dans Bibliothèque"
                disabled
              />
            </label>
            <button type="button" className="library-new-button" disabled>
              Nouveau <ChevronDown size={15} />
            </button>
            <button
              type="button"
              className="library-icon-button"
              aria-label="Paramètres de la bibliothèque"
              disabled
            >
              <SlidersHorizontal size={17} />
            </button>
          </div>
        </header>

        <nav className="library-tabs" aria-label="Sections de la bibliothèque">
          {libraryTabs.map((tab) => (
            <button
              type="button"
              key={tab}
              className={`library-tab${activeTab === tab ? " active" : ""}`}
              aria-current={activeTab === tab ? "page" : undefined}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === "Images" && (
          <div className="library-references">
            <span>Références</span>
            <button type="button" disabled>
              <Plus size={16} />
              Ajouter
            </button>
          </div>
        )}

        <section className="library-empty-state" aria-live="polite">
          {activeTab === "Dossiers" && (
            <span className="library-empty-icon" aria-hidden="true">
              <List size={22} />
            </span>
          )}
          <h2>{emptyState.title}</h2>
          {emptyState.description && <p>{emptyState.description}</p>}
          {activeTab === "Dossiers" && (
            <button type="button" className="library-create-folder" disabled>
              Créer un dossier
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
