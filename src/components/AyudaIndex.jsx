import React from "react";
import { CodereHelmet, searchHelp } from "../data/helpers";
import myStore from "../mobx/myStore";
import { Link } from "react-router-dom";

const quickLinks = [
  {
    title: "Recuperar contraseña",
    desc: "Restablece tu acceso fácilmente",
  },
  {
    title: "Verificar tu cuenta",
    desc: "Completa la verificación",
  },
  {
    title: "Depósito mínimo y métodos",
    desc: "Consulta opciones disponibles",
  },
  {
    title: "Retirar dinero (online y presencial)",
    desc: "Retira tus fondos",
  },
  {
    title: "Cancelar cuenta",
    desc: "Cierra tu cuenta",
  },
  {
    title: "Contactar soporte 24/7",
    desc: "Obtén ayuda inmediata",
  },
  {
    title: "Descargar la app",
    desc: "Instala la aplicación",
  },
  {
    title: "Bonos: cómo funcionan",
    desc: "Entiende los bonos",
  },
];

const categories = ["Cuenta", "Depósitos", "Retiros", "Bonos", "App"];

const AyudaIndex = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const [searchedContent, setSearchedContent] = React.useState([]);

  React.useEffect(() => {
    let res = searchHelp(myStore.data, searchInput, { limit: 15 });
    setSearchedContent([...res]);
  }, [searchInput]);

  CodereHelmet({
    title: "Centro de Ayuda Codere: Soporte 24/7 | Codere®",
    description:
      "Encuentra soluciones rápidas en Codere: recuperar contraseña, verificar tu cuenta, depósitos mínimos, retiros online o en sucursal y contacto con soporte 24/7.",
    url: "/ayuda",
  });

  return (
    <div className="w-8/9 md:w-3/4 xl:w-3/5 mx-auto min-h-screen">
      {/* HERO */}
      <section className="mt-5">
        <h1 className="text-[24px] min-[767px]:text-[28px] text-green font-medium leading-none">
          Centro de ayuda Codere
        </h1>

        <p className="mt-2">Busca tu duda</p>

        <div className="w-full md:w-2/5 xl:w-1/3 flex flex-col">
          <div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Busca: recuperar contraseña, depósito mínimo, retirar dinero…"
              className="w-full mt-2 border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green"
            />
            <div className="flex flex-wrap gap-1 mt-3">
              {categories.map((cat, i) => (
                <span
                  onClick={() => setSearchInput(cat)}
                  key={i}
                  className="text-sm border px-3 py-1 rounded-full cursor-pointer hover:text-black hover:bg-[#79c000] transition"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {searchedContent.length > 0 && (
            <div className="h-[150px] mt-3 overflow-y-auto custom-scroll">
              {searchedContent.map((item) => (
                <div
                  key={item.id}
                  className="border-b py-1 px-2 hover:ps-5 hover:bg-[#79c000] transition-all transition-200_"
                >
                  <Link to={item.url}>{item.label}</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="mt-6">
        <h2 className="text-green text-2xl">
          Accesos directos más consultados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {quickLinks.map((item, i) => (
            <div
              key={i}
              className="border h-[150px] text-center flex flex-col justify-center rounded-md p-3 hover:shadow-sm cursor-pointer transition"
            >
              {/* <div className="text-green text-sm">Icono</div> */}

              <h3 className="mt-1 font-medium">{item.title}</h3>

              <p className="text-sm mt-1 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT */}
      <section className="mt-6 mb-10">
        <h2 className="text-green text-2xl">¿Necesitas más ayuda?</h2>

        <div className="mt-3 border rounded-md p-4">
          <p className="font-medium">Soporte 24/7</p>

          <div className="mt-2 text-sm">
            <a
              href="https://www.codere.mx/ayuda/contacto"
              className="underline cursor-pointer"
            >
              Chat
            </a>{" "}
            /{" "}
            <a
              href="https://api.whatsapp.com/send/?phone=525536977637&text=Hola%2C+necesito+ayuda+personalizada+de+atenci%C3%B3n+al+cliente.+%C2%A1Gracias%21&type=phone_number&app_absent=0"
              className="underline cursor-pointer"
            >
              WhatsApp
            </a>{" "}
            /{" "}
            <a
              href="mailto:apuestas@codere.mx"
              className="underline cursor-pointer"
            >
              Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AyudaIndex;
