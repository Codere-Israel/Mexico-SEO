import { observable, action, computed, makeObservable } from "mobx";
import helpData from "../data/helpData.json";

class MyStore {
  // Full help dictionary keyed by topic slug
  data = helpData;

  // Currently selected topic slug (e.g. "cuenta")
  topic = "";

  // Currently selected subtopic slug (e.g. "password-recovery")
  // empty string means "show topic landing page"
  subtopic = "";

  constructor() {
    makeObservable(this, {
      data: observable,
      topic: observable,
      subtopic: observable,
      updateTopic: action,
      updateSubtopic: action,
      reset: action,
      topicNode: computed,
      subtopicNode: computed,
      topicObject: computed,
      subtopicObject: computed,
    });
  }

  // ---- actions ---------------------------------------------------------

  updateTopic(topic) {
    this.topic = topic || "";
    // when changing topic, drop the previous subtopic
    this.subtopic = "";
  }

  updateSubtopic(subtopic) {
    this.subtopic = subtopic || "";
  }

  reset() {
    this.topic = "";
    this.subtopic = "";
  }

  // ---- computed --------------------------------------------------------

  // Full topic node (with items, page, etc.) for the current topic
  get topicNode() {
    return this.data?.[this.topic] ?? null;
  }

  // Full subtopic node (the selected article) under the current topic
  get subtopicNode() {
    if (!this.topicNode || !this.subtopic) return null;
    return this.topicNode.items?.[this.subtopic] ?? null;
  }

  // Map consumed by NavigationBar: { subtopicSlug: { id, url } }
  // - For a topic with items -> map of its items
  // - For a topic without items -> empty object (nav bar hides)
  get topicObject() {
    const items = this.topicNode?.items;
    if (!items) return {};
    const out = {};
    for (const [slug, node] of Object.entries(items)) {
      out[slug] = { id: node.label ?? node.id ?? slug, url: node.url ?? "#" };
    }
    return out;
  }

  // Page payload consumed by ContentLayout: { seo, top, content }
  // Falls back to the topic landing page when no subtopic is selected.
  get subtopicObject() {
    return this.subtopicNode?.page ?? this.topicNode?.page ?? null;
  }
}

const myStore = new MyStore();
export default myStore;
