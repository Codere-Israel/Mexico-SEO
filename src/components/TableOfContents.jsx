import React from "react";

const TableOfContents = ({ tableList }) => {
  const goToSection = (e, destination) => {
    e.preventDefault();
    // const headerHeight = 0;
    const element = document.getElementById(`par-${destination}`);

    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="table-of-contents bg-[#333] my-4 p-3">
      <h2>Tabla de contenidos</h2>
      <ul className="grid grid-cols-2 ps-3 pt-2">
        {(tableList || []).map((li, i) => (
          <li className="pt-1" key={i}>
            <i />
            <span onClick={(e) => goToSection(e, i)}>{li}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
