import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import IndexLayout from "../components/IndexLayout";
import ContentLayout from "../components/ContentLayout";
import myStore from "../mobx/myStore";
import eventos from "../data/events.json";
import deportes from "../data/cuotas.json";

const SeoRoutes = () => {
  // TODO: work on subTopic !!!!
  const location = useLocation();
  const [subtopicObject, setSubtopicObject] = useState({});
  useEffect(() => {
    let p = location.pathname;
    let temp = p.includes("eventos") ? "eventos" : "deportes";
    myStore.updateTopic(temp);
    myStore.setTopicObject(temp === "eventos" ? eventos : deportes);
    let hasSubtopic = p.split("/").filter((item) => !!item).length > 1;

    if (hasSubtopic) {
      let tempSubtopic = getSubtopicByLocation(p);
      myStore.updateSubtopic(tempSubtopic[0]);
      setSubtopicObject({ ...tempSubtopic[1] });
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);

  const getSubtopicByLocation = (location) => {
    let [key, value] = Object.entries(myStore.topicObject || {}).find(
      ([_, value]) => value.url === location
    ) || [null, null];

    return [key, value];
  };
  return (
    <>
      <Routes>
        <Route exact path="eventos">
          <Route exact path="" element={<IndexLayout topic="eventos" />} />
          <Route
            exact
            path=":event"
            element={<ContentLayout subtopicObject={subtopicObject} />}
          />
        </Route>
        <Route exact path="deportes">
          <Route exact path="" element={<IndexLayout topic="deportes" />} />
          <Route
            exact
            path=":cuota"
            element={<ContentLayout subtopicObject={subtopicObject} />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default SeoRoutes;
