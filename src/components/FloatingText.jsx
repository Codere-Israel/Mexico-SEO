import React from "react";
import myStore from "../mobx/myStore";
import { observer } from "mobx-react";
import { REGISTER } from "../data/helpers";

const FloatingText = observer(({ text }) => {
  const topic = myStore.topic;
  console.log("topic > ", topic);

  return (
    <div className="floating">
      <div className="floating-title uppercase font-bold leading-none  xl:w-3/10">
        {text}
      </div>
      {/* <br /> */}
      <button
        onClick={() => window.open(REGISTER, "_blank")}
        className="floating-button bg-[#0d6efd] mt-5 xl:mt-9  rounded-lg text-[5.2vw]! md:text-3xl! uppercase cursor-pointer font-medium"
      >
        {topic === "casino" ? "Juega ahora" : "Regístrate"}
      </button>
    </div>
  );
});

export default FloatingText;
