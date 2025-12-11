import { observable, action, makeObservable } from "mobx";

class MyStore {
  topic = "";
  subtopic = "";
  topicObject = null;

  constructor() {
    makeObservable(this, {
      topic: observable,
      updateTopic: action,
      subtopic: observable,
      updateSubtopic: action,
      topicObject: observable,
      setTopicObject: action,
    });
  }

  updateTopic(topic) {
    this.topic = topic;
  }
  updateSubtopic(subtopic) {
    this.subtopic = subtopic;
  }
  setTopicObject(topicObject) {
    if (!this.topicObject) this.topicObject = topicObject;
    this.topicObject = { ...topicObject };
  }
}

const myStore = new MyStore();
export default myStore;
