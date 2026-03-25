// import { replaceSpanishCharacters } from "../Games";

export default function SportGamesItem({ game }) {
  function dateHandler(raw) {
    const options = {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    };
    const timestamp = parseInt(raw.match(/\d+/)[0], 10);
    const tempDate = new Date(timestamp);
    const now = new Date();

    // Normalize to remove time component for comparison
    const isSameDay = tempDate.toDateString() === now.toDateString();

    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const isTomorrow = tempDate.toDateString() === tomorrow.toDateString();

    const formatted = tempDate.toLocaleString("es-ES", options);

    if (isSameDay)
      return `hoy ${tempDate.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    if (isTomorrow)
      return `mañana ${tempDate.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

    return formatted;
  }

  function urlHandler(betRef, pos) {
    const betSlipPrefix =
      "https://apuestas.codere.mx/add-selns?lang=es_MX?addbet=&bet_ref";

    return `${betSlipPrefix}=${betRef?.[pos]}`;
  }

  const oddTitleHandler = (index) => {
    if (game?.Game?.Results?.length === 3)
      return index === 1 ? "X" : index === 2 ? index : index + 1;
    return index + 1;
  };

  return (
    <div className="card sport-card text-white p-1 cursor-grab">
      <div className="flex justify-between w-full text-sm mb-2 pt-1">
        <div className="w-full text-white flex justify-between px-1 capitalize">
          {" "}
          {!game ? (
            <div className="w-full mb-1 flex justify-between">
              <div className="relative w-5/12 h-4 bg-gray-200 overflow-hidden rounded">
                <div className="absolute inset-0 animate-[shimmer_1.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
              <div className="relative w-4/12 h-4 bg-gray-200 overflow-hidden rounded">
                <div className="absolute inset-0 animate-[shimmer_1.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <img
                  style={{ maxWidth: 13 }}
                  src={`https://www.codere.mx/library/soccer.svg`}
                />
                <span className="text-elepsis">{game.LeagueName}</span>
              </div>
              <span
                className={`fw-light flex items-center gap-1 ${
                  game.IsLive && "bg-danger"
                } px-1 rounded-2`}
              >
                {game.IsLive ? (
                  <span className="flex items-center gap-1">
                    <svg
                      className="fade-vivo"
                      width="15"
                      height="15"
                      viewBox="0 0 39 39"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.1">
                        <path
                          d="M0 19.5C0 8.73045 8.73045 0 19.5 0C30.2696 0 39 8.73045 39 19.5C39 30.2696 30.2696 39 19.5 39C8.73045 39 0 30.2696 0 19.5Z"
                          fill="#fff"
                        />
                      </g>
                      <g opacity="0.2">
                        <path
                          d="M4.3335 19.5C4.3335 11.1237 11.1238 4.33337 19.5002 4.33337C27.8765 4.33337 34.6668 11.1237 34.6668 19.5C34.6668 27.8764 27.8765 34.6667 19.5002 34.6667C11.1238 34.6667 4.3335 27.8764 4.3335 19.5Z"
                          fill="#fff"
                        />
                      </g>
                      <g opacity="0.2">
                        <path
                          d="M8.6665 19.5C8.6665 13.5169 13.5168 8.66663 19.4998 8.66663C25.4829 8.66663 30.3332 13.5169 30.3332 19.5C30.3332 25.483 25.4829 30.3333 19.4998 30.3333C13.5168 30.3333 8.6665 25.483 8.6665 19.5Z"
                          fill="#fff"
                        />
                      </g>
                      <rect
                        x="13.5"
                        y="13.5"
                        width="12"
                        height="12"
                        rx="6"
                        fill="#fff"
                      />
                    </svg>

                    <label className="fs-12 text-white fw-normal">LIVE</label>
                  </span>
                ) : (
                  dateHandler(game.StartDate)
                )}
              </span>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-between mb-1 w-full">
        {/* HOME */}
        <div className="pl-2 my-[2px] flex justify-between items-center">
          <span className="flex items-center gap-2">
            {!game ? (
              <div className="relative w-[26px] h-[26px] bg-gray-200 overflow-hidden rounded">
                <div className="absolute inset-0 animate-[shimmer_1.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              </div>
            ) : (
              <img
                className={`h-[26px] ${
                  game.ParticipantHomeJerseyUrl
                    ? "w-[26px] visible"
                    : "w-0 invisible"
                }`}
                src={game.ParticipantHomeJerseyUrl}
              />
            )}

            {!game ? (
              <span className="relative inline-block w-[50px] min-h-[10px] bg-gray-200 overflow-hidden rounded">
                <span className="absolute inset-0 animate-[shimmer_1.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></span>
              </span>
            ) : (
              <span className="text-sm text-left leading-none">
                {game?.ParticipantHome}
              </span>
            )}
          </span>
        </div>

        {/* AWAY */}
        <div className="w-full pr-2 my-[2px] flex justify-between items-center flex-row-reverse">
          <span className="flex gap-2 items-center leading-none">
            {!game ? (
              <span className="relative inline-block w-[50px] min-h-[10px] bg-gray-200 overflow-hidden rounded">
                <span className="absolute inset-0 animate-[shimmer_1.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent"></span>
              </span>
            ) : (
              <span className="text-sm text-right">
                {game?.ParticipantAway}
              </span>
            )}

            {game && (
              <img
                className={`h-[26px] ${
                  game.ParticipantAwayJerseyUrl
                    ? "w-[26px] visible"
                    : "w-0 invisible"
                }`}
                src={game.ParticipantAwayJerseyUrl}
              />
            )}
          </span>
        </div>
      </div>
      <div className="flex content-center ">
        {(game?.Game?.Results || Array.from({ length: 3 })).map((result, k) => (
          <div
            key={k}
            className="odds p-1 rounded-md flex flex-col w-full text-center text-sm cursor-pointer"
            onClick={() => window.open(urlHandler(game.betRef, k), "_blank")}
          >
            {!game ? (
              <div className="space-y-2">
                <div className="w-2/12 h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-6/12 h-4 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ) : (
              <>
                <div>{oddTitleHandler(k)}</div>
                <div>{result?.Odd}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
