import { observable, action, makeObservable } from "mobx";

class MyStore {
  topic = "";
  topicObject = null;

  updateTopic(topic) {
    this.topic = topic;
  }
  constructor() {
    makeObservable(this, {
      topic: observable,
      updateTopic: action,
    });
  }
}

const myStore = new MyStore();
export default myStore;
