"use client";

const LINKS = [
  { id: "laksho-uddesho", label: "লক্ষ্য ও উদ্দেশ্য" },
  { id: "mulniti", label: "মূলনীতি" },
  { id: "bibhag", label: "বিভাগ" },
] as const;

type Props = {
  activeSection: string | null;
  onSectionClick: (id: string | null) => void;
};

export default function QuickLinks({ activeSection, onSectionClick }: Props) {
  return (
    <section className="quick-links" id="quick-links">
      <div className="container">
        <div className="quick-links-grid">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onSectionClick(link.id)}
              className={`quick-link-item ${activeSection === link.id ? "quick-link-item-active" : ""}`}
              aria-expanded={activeSection === link.id}
              aria-controls={link.id}
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
