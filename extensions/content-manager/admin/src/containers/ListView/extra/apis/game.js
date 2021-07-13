import React, { useState, useCallback, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { request } from "strapi-helper-plugin";
import endOfMonth from "date-fns/endOfMonth";

import Calendar from "../components/Calendar/Calendar";

const _titleAccessor = (game) => `${game.code} ${game.title}`;
const _tooltipAccessor = (game) => `${game.code} ${game.title}`;
const _startAccessor = (game) => new Date(game.startAt);
const _endAccessor = (game) => new Date(game.endAt);
const _eventPropGetter = (game) => {
  return {
    className: `event-game event-game-status-${game.status}`,
  };
};

const _componentEvent = ({ event: game }) => {
  return (
    <>
      <span className="event-game-code">{game.code}</span>{" "}
      <span className="event-game-title">{game.title}</span>
    </>
  );
};
const _components = {
  event: _componentEvent,
};

const Component = () => {
  const { pathname } = useLocation();
  const { push } = useHistory();

  const [gamesMonthMap, setGamesMonthMap] = useState({});

  const handleCalendarMonthChange = useCallback(
    ({ start }) => {
      const date = start;
      const endOfMonthOfDate = endOfMonth(date);

      const queryKey = `${date?.getFullYear()}-${date?.getMonth()}`;
      if (gamesMonthMap[queryKey]) {
        return;
      }

      const requestUrl = `/content-manager/collection-types/application::game.game?page=1&pageSize=50&_sort=title:ASC&_where[0][startAt_gte]=${date.toISOString()}&_where[1][startAt_lte]=${endOfMonthOfDate.toISOString()}`;

      request(requestUrl, { method: "GET" }).then((result) => {
        setGamesMonthMap((prev) => ({
          ...prev,
          [queryKey]: result.results,
        }));
      });
    },
    [gamesMonthMap, setGamesMonthMap]
  );

  const handleCalendarSelectEvent = useCallback(
    (game) => {
      push({
        pathname: `${pathname}/${game.id}`,
      });
    },
    [pathname, push]
  );
  // (game) => {
  // 	history.push(`${routeMatch.url}/${game.id}`)
  // },
  // [history]

  const games = useMemo(
    () => [].concat(...Object.values(gamesMonthMap)),
    [gamesMonthMap]
  );

  return (
    <Calendar
      onMonthChange={handleCalendarMonthChange}
      onSelectEvent={handleCalendarSelectEvent}
      events={games}
      startAccessor={_startAccessor}
      endAccessor={_endAccessor}
      titleAccessor={_titleAccessor}
      tooltipAccessor={_tooltipAccessor}
      eventPropGetter={_eventPropGetter}
      components={_components}
      style={{ height: 600 }}
    />
  );
};

export const gameTabsWithComponent = {
  calendar: {
    label: "月曆",
    component: <Component />,
  },
};
