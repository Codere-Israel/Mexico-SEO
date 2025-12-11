import myStore from "../mobx/myStore";
import FloatingText from "./FloatingText";
import { CodereHelmet } from "../data/helpers";
import { useLocation } from "react-router-dom";
import TableOfContents from "./TableOfContents";

const ContentLayout = ({ subtopicObject }) => {
  const splitParagraphs = (text) => text?.split("*")?.filter(Boolean);
  const tableList = subtopicObject?.content?.map((item) => item.title);

  const location = useLocation();

  function renderSection(section, depth = 1, key) {
    const Heading = depth === 1 ? "h2" : "h3";

    return (
      <section
        id={`${depth === 1 ? "par" : "sub"}-${key}`}
        key={key}
        className={`mt-${depth === 1 ? 5 : 2}`}
      >
        {/* Title */}
        {section.title && (
          <Heading
            className={`text-green ${depth === 1 ? "text-2xl" : "text-xl"}`}
          >
            {section.title}
          </Heading>
        )}

        {section?.description &&
          splitParagraphs(section?.description).map((p, idx) => (
            <p key={idx} className={`mt-${!idx ? 0 : 2}`}>
              {p}
            </p>
          ))}

        {/* UL List */}
        {section?.ul && (
          <ul className="list-disc ml-6 mt-2">
            {section.ul.map((item, i) => (
              <li key={i} className="mt-1">
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* TABLE */}
        {section?.table && <Table table={section.table} />}

        {/* SUB-SECTIONS → always h3 */}
        {section?.subcontent && (
          <div className="ps-4">
            {section?.subcontent.map((sub, sIdx) =>
              renderSection(sub, 2, sIdx)
            )}
          </div>
        )}
      </section>
    );
  }
  const IMAGE_PREFIX = `https://www.codere.mx/library/SEO_pages_assets/img/${
    myStore?.topic
  }/${myStore?.subtopic?.toLowerCase()}`;
  // const IMAGE_PREFIX = `https://portal-admin.codere.mx/library/SEO_pages_assets/img/${
  //   myStore?.topic
  // }/${myStore?.subtopic?.toLowerCase()}`;

  return (
    <>
      {CodereHelmet(subtopicObject?.seo, location.pathname)}
      <FloatingText text={subtopicObject?.floating} />

      <picture>
        <source
          srcset={`${IMAGE_PREFIX}/m-hero.jpg`}
          media="(max-width: 768px)"
        />
        <source
          srcset={`${IMAGE_PREFIX}/d-hero.jpg`}
          media="(min-width: 769px)"
        />
        <img
          srcset={`${IMAGE_PREFIX}/d-hero.jpg`}
          alt=""
          loading="eager"
          className="responsive-picture"
        />
      </picture>

      <div className="w-8/9 xl:w-3/5 mx-auto">
        {/* Top Section */}
        <section className="top-section mt-5">
          <h1 className="text-2xl md:text-3xl text-green font-medium leading-none">
            {subtopicObject?.top?.title}
          </h1>

          {splitParagraphs(subtopicObject?.top?.description)?.map(
            (p, index) => (
              <p className="mt-1" key={index}>
                {p}
              </p>
            )
          )}
        </section>

        <div className="md:block hidden">
          <TableOfContents tableList={tableList} />
        </div>

        {subtopicObject?.content?.map((section, index) =>
          renderSection(section, 1, index)
        )}
      </div>

      <picture>
        <source
          srcSet={`${IMAGE_PREFIX}/m-${myStore.subtopic?.toLowerCase()}-1.jpg`}
          media="(max-width: 768px)"
        />
        <source
          srcSet={`${IMAGE_PREFIX}/d-${myStore.subtopic?.toLowerCase()}-1.jpg`}
          media="(min-width: 769px)"
        />

        <img
          src={`${IMAGE_PREFIX}/d-${myStore.subtopic?.toLowerCase()}-1.jpg`} // must use src, not srcSet
          onError={(e) => {
            const img = e.currentTarget;
            img.onerror = null;

            img.src = `${IMAGE_PREFIX.replace(
              "www",
              "portal-admin"
            )}/d-${myStore.subtopic?.toLowerCase()}-1.jpg`;
          }}
          className="w-10/11 xl:w-3/5 my-4 mx-auto"
          loading="eager"
          alt=""
        />
      </picture>
    </>
  );
};

export const Table = ({ table }) => {
  return (
    <div className="md:w-1/3! w-full!">
      {/* Mobile: scroll | Desktop: no scroll */}
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
                {row.map((cell, cIdx) => (
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
