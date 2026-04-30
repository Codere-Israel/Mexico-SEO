import React from "react";
import myStore from "../mobx/myStore";
import { observer } from "mobx-react";
import FloatingText from "./FloatingText";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CodereHelmet } from "../data/helpers";

const EventosLayout = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();
  const PREFIX = "https://www.codere.mx/library/SEO_pages_assets/img/indexes";

  const indexData = {
    eventos: {
      floating: "Vive la Experiencia",
      title: "Los mejores Eventos Deportivos estan en Codere",
      seo: {
        metaTitle: "Eventos Deportivos para Apostar ⋆ Bono hasta $7,000",
        metaDescription:
          "Entra a Codere y domina tus apuestas en línea. Disfruta la mejor oferta en apuestas en vivo y sigue los mercados desde casa. ¡Tu jugada empieza aquí!",
      },
    },
  };

  return (
    <>
      {CodereHelmet(indexData?.[myStore.topic]?.seo, location.pathname)}

      <div>
        <FloatingText text={indexData?.[myStore.topic]?.floating || ""} />
        <picture>
          <source
            srcSet={`${PREFIX}/hero-mobile.jpg`}
            media="(max-width: 768px)"
          />
          <source
            srcSet={`${PREFIX}/hero-desktop.jpg`}
            media="(min-width: 769px)"
          />
          <img
            srcSet={`${PREFIX}/hero-desktop.jpg`}
            loading="eager"
            className="responsive-picture"
          />
        </picture>
      </div>

      <div className="mt-5 flex-justify-center-items-center-flex-wrap grid gap-2 md:gap-3 grid-cols-2 md:grid-cols-3 w-19/20 xl:w-3/4 mx-auto">
        {Object.entries(myStore.topicObject || {})?.map(([key, value]) => (
          <div
            onClick={() => navigate(myStore.topicObject?.[key]?.url)}
            className="cursor-pointer flex justify-center items-center flex-col gap-1 bg-[#323f47] p-1! py-[8.1px]! md:px-4! rounded-md"
          >
            <Link
              to={myStore.topicObject?.[key]?.url}
              className="uppercase text-[14px] md:text-[15px] xl:text-[18px] font-bold text-green"
            >
              <h2 className="show-md text-green">
                {value.indexTitle || `apuestas de ${value.id}`}
              </h2>

              <h2 className="hide-md text-green">{value.id}</h2>
            </Link>
            <img width={450} src={`${PREFIX}/${key}-promo.jpg`} />
            <button
              className="seo-btn w-full mt-1 py-[7px]! my-[5.1px] uppercase font-bold text-[2.85vw] md:text-[16px]"
              onClick={() => navigate(myStore.topicObject?.[key]?.url)}
            >
              Ver información
            </button>
          </div>
        ))}
      </div>
    </>
  );
});

export default EventosLayout;
