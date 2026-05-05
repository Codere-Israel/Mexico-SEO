import React from "react";
import { CodereHelmet } from "../data/helpers";

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
  CodereHelmet({
    title: "Centro de Ayuda Codere: Soporte 24/7 | Codere®",
    description:
      "Encuentra soluciones rápidas en Codere: recuperar contraseña, verificar tu cuenta, depósitos mínimos, retiros online o en sucursal y contacto con soporte 24/7.",
    url: "/ayuda",
  });

  return (
    <div className="w-8/9 xl:w-3/5 mx-auto min-h-screen">
      {/* HERO */}
      <section className="mt-5">
        <h1 className="text-[24px] min-[767px]:text-[28px] text-green font-medium leading-none">
          Centro de ayuda Codere
        </h1>

        <p className="mt-2">Busca tu duda</p>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Busca: recuperar contraseña, depósito mínimo, retirar dinero…"
          className="w-full mt-2 border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-green"
        />

        {/* CATEGORIES */}
        <div className="flex flex-wrap gap-2 mt-3">
          {categories.map((cat, i) => (
            <span
              key={i}
              className="text-sm border px-3 py-1 rounded-full cursor-pointer hover:bg-gray-100"
            >
              {cat}
            </span>
          ))}
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
              className="border rounded-md p-3 hover:shadow-sm cursor-pointer transition"
            >
              <div className="text-green text-sm">Icono</div>

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
            <span className="underline cursor-pointer">Chat</span> /{" "}
            <span className="underline cursor-pointer">WhatsApp</span> /{" "}
            <span className="underline cursor-pointer">Email</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AyudaIndex;
