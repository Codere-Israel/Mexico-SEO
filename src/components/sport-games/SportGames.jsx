import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SportGamesItem from "./SportGamesItem";

export function encodingFromSpanish(brokenString) {
  // Step 1: Convert the broken string (misinterpreted as ISO-8859-1) into a byte array.
  const byteArray = new Uint8Array(brokenString.length);

  for (let i = 0; i < brokenString.length; i++) {
    byteArray[i] = brokenString.charCodeAt(i);
  }

  // Step 2: Use TextDecoder to decode the byte array correctly as UTF-8
  const decoder = new TextDecoder("utf-8");
  const fixedString = decoder.decode(byteArray);
  return fixedString;
}
export default function SportGames() {
  const [sportGamesAreInvalid, setSportGamesAreInvalid] = useState(false);
  const [title, setTitle] = useState("");

  const config = [
    { title: "Liga de México", leagueId: "45349" },
    { title: "Premier League", leagueId: "45966" },
  ];
  // const titles = ["Liga de México", "Premier League"];

  // const ENDPOINT = `${process.env.REACT_APP_SERVER}/mx/fetch-marque-games1`; // to test fallback
  const [marqueeGames, setMarqueeGames] = useState(null);
  const swiperRef = useRef(null);

  const fetchGames = (flag) => {
    if (flag > 1) return setSportGamesAreInvalid(true);

    // const ENDPOINT = `${process.env.REACT_APP_SERVER}/mx/fetch-marque-games?leagueId=${config?.[flag].leagueId}`;
    const ENDPOINT = `https://coderesbgonlinesbsbanners.azurewebsites.net/api/mexicoOddsFeeds/getMatchMarketsForType/${config?.[flag].leagueId}/MRES`;
    // const HEADERS = { headers: JSON.parse(process.env.REACT_APP_SER_HEADER) };

    axios.get(ENDPOINT).then((res) => {
      const newGames = res.data.ContentAPI.Sport[0].SBClass[0].SBType[0];
      console.log(newGames);
      const mappedGames = newGames?.Ev.map((event) => {
        return convertGames(event, newGames?.["@name"]);
      });

      // if (flag === 0) return fetchGames(flag + 1);
      if (mappedGames?.length < 3) return fetchGames(flag + 1);

      setTitle(`Próximos partidos ${config?.[flag].title}`);
      setMarqueeGames([...mappedGames]);
    });
  };

  useEffect(() => {
    fetchGames(0);
  }, []);

  const convertGames = (event, ligaName) => {
    const team1 = encodingFromSpanish(event.Teams[0].Team[0]["@name"] ?? "");
    const team2 = encodingFromSpanish(event.Teams[0].Team[1]["@name"] ?? "");
    const betRef = event.Mkt[0].Seln.map((seln) => seln.Price[0]["@bet_ref"]);
    const IsLive = event?.["@inplay_now"] === "Y";
    // e.Mkt[0].Seln[t].Price[0]["@bet_ref"]

    return {
      ParticipantHome: team1,
      ParticipantAway: team2,
      ParticipantHomeJerseyUrl: "",
      ParticipantAwayJerseyUrl: "",
      LeagueName: ligaName,
      IsLive,
      SportHandle: "football",
      StartDate: `/Date(${new Date(event["@start_time"]).getTime()})/`,
      betRef,
      Game: {
        Results: event.Mkt[0].Seln.map((odd) => ({
          Odd: odd.Price[0]["@us_prc"],
        })),
      },
    };
  };

  if (sportGamesAreInvalid) return <div></div>;

  return (
    <div className="w-full mx-auto mt-4 pb-2 px-2 sport-games-section">
      {!!marqueeGames && (
        <div className="flex justify-center gap-3 items-center pt-0 md:pt-1">
          {!marqueeGames?.length ? (
            <div className="w-full mb-1 flex justify-center">
              <div className="relative w-1/3 h-4 bg-gray-200 overflow-hidden rounded">
                <div className="absolute inset-0 animate-[shimmer_1.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            </div>
          ) : (
            <span className="text-center uppercase font-bold text-white text-[5vw] leading-[1.6] md:text-[1.7vw]">
              {title}
            </span>
          )}
        </div>
      )}
      <Swiper
        className={`relative pt-1 ${
          marqueeGames?.length < 4 ? "2xl:justify-center" : ""
        }`}
        id="sportgames"
        breakpoints={{
          320: {
            slidesPerView: 1.2,
          },
          376: { slidesPerView: 1.35 },
          768: { slidesPerView: 2.3 },
          1024: {
            slidesPerView: 3.68,
          },
          1440: {
            slidesPerView: 4.3,
          },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        autoplay={{ delay: 400 }}
        spaceBetween={5}
      >
        {(marqueeGames || Array.from({ length: 10 })).map((game, i) => (
          <SwiperSlide key={game?.NodeId || i}>
            <SportGamesItem game={game || null} />
          </SwiperSlide>
        ))}
        {<div className="swiper-shadow-right" />}
      </Swiper>
    </div>
  );
}
