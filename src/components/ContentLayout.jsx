import React from "react";
import { observer } from "mobx-react";
import { useLocation } from "react-router-dom";
import myStore from "../mobx/myStore";
import { CodereHelmet } from "../data/helpers";

const splitParagraphs = (text) =>
  typeof text === "string" ? text.split("*").filter(Boolean) : [];

function renderSection(section, depth = 1, idx = 0) {
  if (!section) return null;
  const Heading = depth === 1 ? "h2" : "h3";
  const headingClass = depth === 1 ? "text-2xl" : "text-xl";
  const sectionMargin = depth === 1 ? "mt-5" : "mt-2";
  const sectionPrefix = depth === 1 ? "par" : "sub";

  return (
    <section id={`${sectionPrefix}-${idx}`} className={sectionMargin}>
      {section.title && (
        <Heading className={`text-green ${headingClass}`}>
          {section.title}
        </Heading>
      )}

      {splitParagraphs(section.description).map((p, i) => (
        <p key={i} className={i === 0 ? "" : "mt-2"}>
          {p}
        </p>
      ))}

      {Array.isArray(section.ul) && section.ul.length > 0 && (
        <ul className="list-disc ml-6 mt-2">
          {section.ul.map((item, i) => (
            <li key={i} className="mt-1">
              {item}
            </li>
          ))}
        </ul>
      )}

      {section.table && <Table table={section.table} />}

      {Array.isArray(section.subcontent) && section.subcontent.length > 0 && (
        <div className="ps-4">
          {section.subcontent.map((sub, sIdx) => (
            <React.Fragment key={sIdx}>
              {renderSection(sub, depth + 1, sIdx)}
            </React.Fragment>
          ))}
        </div>
      )}
    </section>
  );
}

const ContentLayout = observer(({ subtopicObject: propsObject }) => {
  // Allow the component to work either with an explicit prop OR by reading
  // from the store directly (when used as a route page).
  const subtopicObject = propsObject ?? myStore.subtopicObject;
  const location = useLocation();

  if (!subtopicObject) {
    return (
      <div className="w-8/9 md:w-3/4 xl:w-3/5 mx-auto py-10 text-center">
        <p>Selecciona un tema en el menú lateral para ver su contenido.</p>
      </div>
    );
  }

  const top = subtopicObject.top || {};
  const content = Array.isArray(subtopicObject.content)
    ? subtopicObject.content
    : [];

  return (
    <>
      {CodereHelmet(subtopicObject?.seo, location.pathname)}

      <div
        className="w-8/9 md:w-3/4 xl:w-3/5 _mx-auto ps-[19px] md:ms-[100px] min-h-screen"
        data-path={location.pathname}
      >
        <section className="top-section mt-5">
          {top.title && (
            <h1 className="text-[24px] min-[767px]:text-[28px] text-green font-medium leading-none">
              {top.title}
            </h1>
          )}

          {splitParagraphs(top.description).map((p, i) => (
            <p key={i} className="mt-1">
              {p}
            </p>
          ))}
        </section>

        {content.map((section, idx) => (
          <React.Fragment key={idx}>
            {renderSection(section, 1, idx)}
          </React.Fragment>
        ))}
      </div>
    </>
  );
});

export const Table = ({ table }) => {
  if (!table || !Array.isArray(table.headers) || !Array.isArray(table.rows)) {
    return null;
  }

  return (
    <div className="md:w-1/3! w-full!">
      <div className="overflow-x-auto md:overflow-visible w-full">
        <table className="mt-2 border text-left text-[10px] md:text-[14px] min-w-max">
          <thead>
            <tr>
              {table.headers.map((header, hIdx) => (
                <th
                  key={hIdx}
                  className="border border-amber-50 px-2! py-1! bg-gray-300 text-black"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rIdx) => (
              <tr key={rIdx}>
                {(Array.isArray(row) ? row : []).map((cell, cIdx) => (
                  <td key={cIdx} className="border px-2! py-1!">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentLayout;
