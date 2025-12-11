import React from "react";
import myStore from "../mobx/myStore";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";

const NavigationBar = observer(() => {
  const ICONS_PREFIX = `https://www.codere.mx/library/SEO_pages_assets/img/icons/{subtopic}.svg`;
  const entries = Object.entries(myStore.topicObject || {});

  return (
    <div className="e-nav flex justify-center pt-3 items-center ps-1">
      {entries.map(([key, value], k) => (
        <React.Fragment key={key}>
          <div
            style={{ width: 80, height: 61 }}
            className={`seo-nav-tab  items-center ${
              key === myStore.subtopic ? `seo-nav-active` : ""
            }`}
          >
            <Link
              to={value.url}
              onClick={() => myStore.updateSubtopic(key)}
              // to={value.url}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                key !== myStore.subtopic ? "hoverable" : ""
              }`}
            >
              <img
                className="h-[29px]"
                src={ICONS_PREFIX.replace("{subtopic}", key.toLowerCase())}
                width={28}
                height={28}
              />
              <span className="seo-nav-title capitalize text-[14px]">
                {value.id}
              </span>
              <span className="underline" />
            </Link>
          </div>
          {k < entries.length - 1 && <div className="c-vr" />}
        </React.Fragment>
      ))}
    </div>
  );
});

export default NavigationBar;
