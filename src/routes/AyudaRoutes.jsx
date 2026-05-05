import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { observer } from "mobx-react";
import ContentLayout from "../components/ContentLayout";
import myStore from "../mobx/myStore";
import AyudaIndex from "../components/AyudaIndex";

/**
 * Walk the help-data tree and find which (topic, subtopic) a given URL
 * corresponds to. Returns ["topicSlug", "subtopicSlug"] — subtopic may be ""
 * when the URL is a topic landing page.
 *
 * Match strategy:
 *   1. exact match on a subtopic url   → [topic, subtopic]
 *   2. exact match on a topic url      → [topic, ""]
 *   3. prefix match on a topic url     → [topic, ""]   (covers nested slugs
 *      where no specific subtopic url is set yet)
 *   4. nothing matches                 → [null, null]
 */
const resolvePath = (data, pathname) => {
  if (!data || !pathname) return [null, null];

  // normalise: strip trailing slash, keep leading slash
  const path = pathname.replace(/\/+$/, "") || "/";

  let topicMatch = null;
  let topicPrefixMatch = null;

  for (const [topicSlug, topic] of Object.entries(data)) {
    // 1. subtopic exact match
    const items = topic.items || {};
    for (const [subSlug, sub] of Object.entries(items)) {
      if (sub.url && sub.url.replace(/\/+$/, "") === path) {
        return [topicSlug, subSlug];
      }
    }

    // 2. topic exact match
    if (topic.url && topic.url.replace(/\/+$/, "") === path) {
      topicMatch = topicSlug;
    }

    // 3. topic prefix match (path starts with topic.url + "/")
    if (
      topic.url &&
      path.startsWith(topic.url.replace(/\/+$/, "") + "/") &&
      (!topicPrefixMatch ||
        topic.url.length > (data[topicPrefixMatch]?.url?.length || 0))
    ) {
      topicPrefixMatch = topicSlug;
    }
  }

  if (topicMatch) return [topicMatch, ""];
  if (topicPrefixMatch) return [topicPrefixMatch, ""];
  return [null, null];
};

const AyudaRoutes = observer(() => {
  const location = useLocation();

  useEffect(() => {
    const [topic, subtopic] = resolvePath(myStore.data, location.pathname);

    if (topic) {
      // only update if it actually changed, to avoid unnecessary re-renders
      if (topic !== myStore.topic) myStore.updateTopic(topic);
      if (subtopic !== myStore.subtopic) myStore.updateSubtopic(subtopic);
    } else {
      myStore.reset();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <Routes>
      {/* /ayuda and any /ayuda/** path renders the same ContentLayout;
          the actual content is driven by the store, which the effect
          above keeps in sync with the URL. */}

      <Route path="ayuda" element={<AyudaIndex />} />
      <Route path="ayuda/*" element={<ContentLayout />} />
    </Routes>
  );
});

export default AyudaRoutes;
