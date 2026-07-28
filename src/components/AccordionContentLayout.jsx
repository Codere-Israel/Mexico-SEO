import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useLocation } from "react-router-dom";
import myStore from "../mobx/myStore";
import { CodereHelmet } from "../data/helpers";

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

const splitParagraphs = (text) => {
  if (typeof text !== "string") return [];

  return text
    .split("*")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

const getAccordionItems = (subtopicObject) => {
  const content = Array.isArray(subtopicObject?.content)
    ? subtopicObject.content
    : [];

  const accordionBlock = content.find(
    (section) => section?.type === "accordion" && Array.isArray(section?.items),
  );

  return accordionBlock?.items || content;
};

const createNodeId = (path = []) => {
  return `node-${path.join("-")}`;
};

const hasNodeContent = (node) => {
  if (!node) return false;

  return (
    Boolean(node.description) ||
    Boolean(node.description_html) ||
    Boolean(node.table) ||
    Boolean(node.sourcePages) ||
    (Array.isArray(node.ul) && node.ul.length > 0) ||
    (Array.isArray(node.ol) && node.ol.length > 0) ||
    (Array.isArray(node.examples) && node.examples.length > 0)
  );
};

/* -------------------------------------------------------------------------- */
/*                                  Collapse                                  */
/* -------------------------------------------------------------------------- */

/**
 * Tailwind collapse component.
 *
 * It animates the real height of the content and uses ResizeObserver
 * so a parent accordion updates when a nested accordion opens.
 */
function Collapse({ isOpen, id, children, duration = 350 }) {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  const updateHeight = () => {
    if (!contentRef.current) return;

    setContentHeight(contentRef.current.scrollHeight);
  };

  useLayoutEffect(() => {
    updateHeight();
  }, [isOpen, children]);

  useEffect(() => {
    const element = contentRef.current;

    if (!element) return undefined;

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      id={id}
      aria-hidden={!isOpen}
      style={{
        height: isOpen ? `${contentHeight}px` : "0px",
        transitionDuration: `${duration}ms`,
      }}
      className={`
        overflow-hidden
        transition-[height,opacity]
        ease-in-out
        ${isOpen ? "visible opacity-100" : "invisible opacity-0"}
      `}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                ContentTable                                */
/* -------------------------------------------------------------------------- */

function ContentTable({ table }) {
  if (
    !table ||
    !Array.isArray(table.headers) ||
    !Array.isArray(table.rows) ||
    table.headers.length === 0
  ) {
    return null;
  }

  return (
    <div className="mt-4 w-full overflow-x-auto">
      <table className="w-full min-w-[650px] border-collapse text-left text-[13px] md:text-[14px]">
        <thead>
          <tr>
            {table.headers.map((header, index) => (
              <th
                key={`header-${index}`}
                className="border border-white/20 bg-white/5 px-3 py-2 font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {(Array.isArray(row) ? row : []).map((cell, cellIndex) => (
                <td
                  key={`cell-${rowIndex}-${cellIndex}`}
                  className="border border-white/20 px-3 py-2 align-top"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 ContentList                                */
/* -------------------------------------------------------------------------- */

function ContentList({ items, type = "ul" }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const ListTag = type;

  return (
    <ListTag
      className={`
        mt-3 space-y-2 ps-6
        ${type === "ol" ? "list-decimal" : "list-disc"}
      `}
    >
      {items.map((item, index) => {
        if (typeof item === "string") {
          return (
            <li key={`${type}-${index}`} className="ps-1">
              {item}
            </li>
          );
        }

        return (
          <li key={`${type}-${index}`} className="ps-1">
            {item?.title && <span className="font-semibold">{item.title}</span>}

            {item?.description && (
              <span className={item?.title ? "ms-1" : ""}>
                {item.description}
              </span>
            )}
          </li>
        );
      })}
    </ListTag>
  );
}

/* -------------------------------------------------------------------------- */
/*                              NodeContent                              */
/* -------------------------------------------------------------------------- */

function NodeContent({ node }) {
  if (!node) return null;

  return (
    <div className="node-content px-4 pb-5 pt-3 md:px-6">
      {splitParagraphs(node.description).map((paragraph, index) => (
        <p key={`paragraph-${index}`} className={index > 0 ? "mt-3" : ""}>
          {paragraph}
        </p>
      ))}

      {node.description_html && (
        <div
          className="html-content mt-3"
          dangerouslySetInnerHTML={{
            __html: node.description_html,
          }}
        />
      )}

      <ContentList items={node.ul} type="ul" />
      <ContentList items={node.ol} type="ol" />

      {node.table && <ContentTable table={node.table} />}

      {Array.isArray(node.examples) && node.examples.length > 0 && (
        <div className="mt-4 space-y-4">
          {node.examples.map((example, index) => (
            <div
              key={`example-${index}`}
              className="border-s-4 border-white/30 bg-white/5 px-4 py-3"
            >
              {example?.title && (
                <h4 className="mb-2 font-semibold">{example.title}</h4>
              )}

              {splitParagraphs(example?.description).map(
                (paragraph, paragraphIndex) => (
                  <p
                    key={`example-paragraph-${paragraphIndex}`}
                    className={paragraphIndex > 0 ? "mt-2" : ""}
                  >
                    {paragraph}
                  </p>
                ),
              )}

              <ContentList items={example?.ul} type="ul" />

              <ContentList items={example?.ol} type="ol" />

              {example?.table && <ContentTable table={example.table} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             AccordionItem                             */
/* -------------------------------------------------------------------------- */

function AccordionItem({ node, depth, path, isOpen, onToggle }) {
  if (!node) return null;

  const nodeId = createNodeId(path);
  const contentId = `${nodeId}-content`;

  const children = Array.isArray(node.children) ? node.children : [];

  const hasChildren = children.length > 0;
  const hasDirectContent = hasNodeContent(node);

  const titleClasses =
    depth === 0
      ? "text-[15px] md:text-[16px]"
      : depth === 1
        ? "text-[14px] md:text-[15px]"
        : "text-[13px] md:text-[14px]";

  const indentationClasses =
    depth === 0 ? "" : depth === 1 ? "ms-3 md:ms-5" : "ms-3 md:ms-6";

  return (
    <div
      id={nodeId}
      className={`
        cursor-pointer
        ${indentationClasses}
        ${depth === 0 ? "mb-2" : "mb-1"}
      `}
    >
      <h2 className="m-0">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={onToggle}
          className={`
            group
            flex
            w-full
            items-center
            justify-between
            gap-4
            px-4
            py-3
            text-left
            font-semibold
            transition-colors
            duration-200
            ease-in-out
            cursor-pointer
            hover:bg-white/5
            focus-visible:outline
            focus-visible:outline-2
            focus-visible:outline-offset-[-2px]
            focus-visible:outline-green
            ${titleClasses}
          `}
        >
          <span>{node.title}</span>

          <span
            aria-hidden="true"
            className={`
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              text-xl
              font-normal
              leading-none
              transition-transform
              duration-300
              ease-in-out
              ${isOpen ? "rotate-45" : "rotate-0"}
            `}
          >
            +
          </span>
        </button>
      </h2>

      <Collapse isOpen={isOpen} id={contentId}>
        <div
          className={`
            ${depth > 0 ? "border-s border-white/10" : ""}
          `}
        >
          {hasDirectContent && <NodeContent node={node} />}

          {hasChildren && (
            <div
              className={`
                pb-4 pt-1
                ${hasDirectContent ? "border-t border-white/10" : ""}
                ${depth === 0 ? "px-2 md:px-4" : "px-1 md:px-2"}
              `}
            >
              <Accordion items={children} depth={depth + 1} path={path} />
            </div>
          )}
        </div>
      </Collapse>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Accordion                               */
/* -------------------------------------------------------------------------- */

/**
 * Every accordion level manages its own active item.
 *
 * This gives Bootstrap-like behavior:
 * only one item is open per level.
 */
function Accordion({ items, depth = 0, path = [], defaultOpenIndex = null }) {
  const [activeIndex, setActiveIndex] = useState(defaultOpenIndex);

  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const handleToggle = (index) => {
    setActiveIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  return (
    <div className="w-full">
      {items.map((node, index) => {
        const itemPath = [...path, index];

        return (
          <AccordionItem
            key={createNodeId(itemPath)}
            node={node}
            depth={depth}
            path={itemPath}
            isOpen={activeIndex === index}
            onToggle={() => handleToggle(index)}
          />
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           AccordionContentLayout                           */
/* -------------------------------------------------------------------------- */

const AccordionContentLayout = observer(({ subtopicObject: propsObject }) => {
  const subtopicObject = propsObject ?? myStore.subtopicObject;

  const location = useLocation();

  if (!subtopicObject) {
    return (
      <div className="mx-auto w-8/9 py-10 text-center md:w-3/4 xl:w-3/5">
        <p>Selecciona un tema en el menú lateral para ver su contenido.</p>
      </div>
    );
  }

  const top = subtopicObject.top || {};

  const accordionItems = getAccordionItems(subtopicObject);

  return (
    <>
      {CodereHelmet(subtopicObject?.seo, location.pathname)}

      <main
        className="
            min-h-screen
            w-8/9
            ps-[19px]
            md:ms-[100px]
            md:w-3/4
            xl:w-3/5
          "
        data-path={location.pathname}
      >
        <section className="mt-5 pb-4">
          {top.title && (
            <h1 className="text-[24px] font-medium leading-tight text-green min-[767px]:text-[28px]">
              {top.title}
            </h1>
          )}

          {splitParagraphs(top.description).map((paragraph, index) => (
            <p
              key={`top-paragraph-${index}`}
              className={index === 0 ? "mt-2" : "mt-3"}
            >
              {paragraph}
            </p>
          ))}

          {top.description_html && (
            <div
              className="mt-2"
              dangerouslySetInnerHTML={{
                __html: top.description_html,
              }}
            />
          )}
        </section>

        <section className="min-h-screen overflow-y-auto  pb-6 pe-2 pt-2 md:h-[540px] xl:h-[600px]">
          <Accordion
            items={accordionItems}
            depth={0}
            path={[]}
            defaultOpenIndex={null}
          />
        </section>
      </main>
    </>
  );
});

export default AccordionContentLayout;
