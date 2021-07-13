import React, { useCallback, useMemo } from "react";

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
  const handleCalendarMonthChange = useCallback(({ start }) => {
    // const prevMonth = addMonths(start, -1)
    // const nextMonth = addMonths(start, 1)
    // const thisMonth = start
    // Promise.all(
    // 	[prevMonth, thisMonth, nextMonth].map((date) => {
    // 		const queryKey = `${date?.getFullYear()}-${date?.getMonth()}`
    // 		const endOfMonthOfDate = endOfMonth(date)
    // 		return queryClient.fetchQuery(
    // 			['games', queryKey],
    // 			() => getGamesByDateRange(date, endOfMonthOfDate),
    // 			{
    // 				staleTime: 60000,
    // 			}
    // 		)
    // 	})
    // ).then((arrayOfGames) => {
    // 	setGames(([]).concat(...arrayOfGames))
    // })
  }, []);

  const handleCalendarSelectEvent = useCallback(() => {}, []);
  // (game) => {
  // 	history.push(`${routeMatch.url}/${game.id}`)
  // },
  // [history]

  const games = useMemo(() => [], []);

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
