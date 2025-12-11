import React from "react";
import myStore from "../mobx/myStore";
import { observer } from "mobx-react";
import FloatingText from "./FloatingText";
import { Link, useNavigate } from "react-router-dom";

const IndexLayout = observer(() => {
  const navigate = useNavigate();
  const PREFIX = "https://www.codere.mx/library/SEO_pages_assets/img/indexes";
  // const PREFIX =
  //   "https://portal-admin.codere.mx/library/SEO_pages_assets/img/indexes";

  const indexData = {
    deportes: {
      floating: "Deportes En Vivo",
      title: "Encuentra las mejores Cuotas Deportivas en Codere",
      seo: {
        metaTitle: "",
        metaDescription: "",
      },
    },
    eventos: {
      floating: "Vive la Experiencia",
      title: "Los mejores Eventos Deportivos estan en Codere",
      seo: {
        metaTitle: "",
        metaDescription: "",
      },
    },
  };

  return (
    <div>
      <FloatingText text={indexData?.[myStore.topic]?.floating || ""} />

      <picture>
        <source
          srcset={`${PREFIX}/hero-mobile.jpg`}
          media="(max-width: 768px)"
        />
        <source
          srcset={`${PREFIX}/hero-desktop.jpg`}
          media="(min-width: 769px)"
        />
        <img
          srcset={`${PREFIX}/hero-desktop.jpg`}
          alt=""
          loading="eager"
          className="responsive-picture"
        />
      </picture>

      <h1 className="text-center text-white! my-5! text-[24px]! w-3/4! mx-auto! md:text-[40px]! font-medium!">
        {indexData?.[myStore.topic]?.title}
      </h1>

      <div className="flex-justify-center-items-center-flex-wrap grid gap-2 md:gap-3 grid-cols-2 md:grid-cols-3 w-19/20 xl:w-3/4 mx-auto">
        {Object.entries(myStore.topicObject || {})?.map(([key, value]) => (
          <div
            onClick={() => navigate(myStore.topicObject?.[key]?.url)}
            className="cursor-pointer flex justify-center items-center flex-col gap-1 bg-[#323f47] p-1! py-[8.1px]! md:px-4! rounded-md"
          >
            <Link
              to={myStore.topicObject?.[key]?.url}
              className="uppercase text-[14px] md:text-[15px] xl:text-[18px] font-bold text-green"
            >
              <span className="show-md">
                {value.indexTitle || `apuestas de ${value.id}`}
              </span>

              <span className="hide-md">{value.id}</span>
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
    </div>
  );
});

export default IndexLayout;
