import React, { useEffect, useState } from "react";
import myStore from "../mobx/myStore";
import { observer } from "mobx-react";
import { Link, useNavigate } from "react-router-dom";

const groupItems = (topic) => {
  const items = topic?.items || {};
  const entries = Object.entries(items);
  if (entries.length === 0) return [];

  const subCats = Array.isArray(topic.subCategories) ? topic.subCategories : [];
  if (subCats.length === 0) {
    return [{ label: null, items: entries }];
  }

  const claimed = new Set();
  const groups = subCats.map((sc) => {
    const slugs = Array.isArray(sc.items) ? sc.items : [];
    const groupEntries = slugs
      .filter((slug) => items[slug])
      .map((slug) => {
        claimed.add(slug);
        return [slug, items[slug]];
      });
    return { label: sc.label || sc.id || null, items: groupEntries };
  });

  const orphans = entries.filter(([slug]) => !claimed.has(slug));
  if (orphans.length > 0) {
    groups.push({ label: null, items: orphans });
  }

  return groups.filter((g) => g.items.length > 0);
};

const SubtopicLink = observer(({ topicSlug, slug, node, onNavigate }) => {
  const isActive = myStore.topic === topicSlug && myStore.subtopic === slug;
  const url = node?.url || "#";
  const label = node?.label || node?.id || slug;

  return (
    <li>
      <Link
        to={url}
        onClick={() => {
          myStore.updateTopic(topicSlug);
          myStore.updateSubtopic(slug);
          onNavigate?.();
        }}
        aria-current={isActive ? "page" : undefined}
        className={`block _py-1 text-[13px] cursor-pointer text-white ps-2 pe-5 ${isActive ? "nav-active" : ""}`}
      >
        {label}
      </Link>
    </li>
  );
});

const TopicHeader = observer(({ topicSlug, topic, onNavigate }) => {
  const isActive = myStore.topic === topicSlug && !myStore.subtopic;
  const url = topic?.url || "#";
  const label = topic?.label || topic?.id || topicSlug;

  return (
    <Link
      to={url}
      onClick={() => {
        myStore.updateTopic(topicSlug);
        myStore.updateSubtopic("");
        onNavigate?.();
      }}
      aria-current={isActive ? "page" : undefined}
      className={`block text-[15px] font-semibold uppercase tracking-wide cursor-pointer text-green`}
    >
      {label}
    </Link>
  );
});

const NavList = observer(({ onNavigate }) => {
  const navigate = useNavigate();
  const data = myStore.data || {};
  const topics = Object.entries(data);

  if (topics.length === 0) return null;

  return (
    <nav
      className="e-nav flex flex-col min-h-full ps-4 gap-1"
      aria-label="Centro de ayuda"
    >
      <div className="flex  gap-2 pb-2 md:py-2 cursor-pointer">
        <img
          src="https://www.codere.mx/library/Logos/support.png"
          alt="Support Logo"
          onError={(e) =>
            (e.target.src = e.target.src.replace("www", "portal-admin"))
          }
          className="h-6"
        />
        <h1
          onClick={() => {
            onNavigate?.();
            navigate("/ayuda");
          }}
          className="font-semibold uppercase text-[20px]"
        >
          Ayuda
        </h1>
      </div>
      {topics.map(([topicSlug, topic]) => {
        const groups = groupItems(topic);

        return (
          <div key={topicSlug} className="seo-nav-section">
            <TopicHeader
              topicSlug={topicSlug}
              topic={topic}
              onNavigate={onNavigate}
            />

            {groups.map((group, gIdx) => (
              <div key={gIdx} className="ml-2_ _mt-1">
                {group.label && (
                  <div className="text-[13px] font-medium text-gray-500 mt-1 mb-1">
                    {group.label}
                  </div>
                )}
                <ul className="flex flex-col">
                  {group.items.map(([slug, node]) => (
                    <SubtopicLink
                      key={slug}
                      topicSlug={topicSlug}
                      slug={slug}
                      node={node}
                      onNavigate={onNavigate}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      })}
    </nav>
  );
});

const NavigationBar = observer(() => {
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Close drawer if viewport grows past mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => {
      if (e.matches) setIsOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button
        type="button"
        className="fixed w-100 md:hidden inline-flex items-center gap-2 bg-[#333F48] justify-start p-3 text-green uppercase"
        aria-label="Abrir menú de ayuda"
        aria-expanded={isOpen}
        aria-controls="ayuda-nav-drawer"
        onClick={() => setIsOpen(true)}
      >
        <img
          src="https://www.codere.mx/library/Logos/support.png"
          alt="Support Logo"
          onError={(e) =>
            (e.target.src = e.target.src.replace("www", "portal-admin"))
          }
          className="h-6"
        />
        {myStore.subtopicNode?.label || myStore.topicNode?.label || "Ayuda"}
      </button>

      <aside className="hidden md:block">
        <NavList />
      </aside>

      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-200 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsOpen(false)}
        />

        <aside
          id="ayuda-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Centro de ayuda"
          className={`absolute top-0 left-0 h-full w-[85%] max-w-[340px] bg-[#333f48] shadow-xl flex flex-col transform transition-transform duration-200 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center gap-3 px-4 pt-2">
            <button
              type="button"
              className="p-1 text-gray-600 hover:text-black"
              aria-label="Cerrar menú"
              onClick={() => setIsOpen(false)}
            ></button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <NavList onNavigate={() => setIsOpen(false)} />
          </div>
        </aside>
      </div>
    </>
  );
});

export default NavigationBar;
