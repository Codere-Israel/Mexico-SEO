import myStore from "../mobx/myStore";
import { observer } from "mobx-react";
import { useLocation } from "react-router-dom";
import EventosLayout from "./EventosLayout";
import ContentLayout from "./ContentLayout";
import SportGames from "./sport-games/SportGames";

const IndexLayout = observer(() => {
  const location = useLocation();

  return (
    <div>
      {location.pathname.includes("eventos") ? (
        <EventosLayout />
      ) : (
        <ContentLayout subtopicObject={myStore.topicObject?.["deportes"]} />
      )}
    </div>
  );
});

export default IndexLayout;
