import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ContentLayout from "../components/ContentLayout";
import myStore from "../mobx/myStore";

const SeoRoutes = () => {
  const location = useLocation();
  const [subtopicObject, setSubtopicObject] = useState({});
  useEffect(() => {
    let p = location.pathname;
    myStore.updateTopic(p);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);

  const getSubtopicByLocation = (location) => {
    let [key, value] = Object.entries(myStore.topicObject || {}).find(
      ([_, value]) => value.url === location,
    ) || [null, null];

    return [key, value];
  };

  return (
    <>
      <Routes>
        <Route exact path="ayuda">
          <Route
            exact
            path=":page"
            element={<ContentLayout subtopicObject={subtopicObject} />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default SeoRoutes;
