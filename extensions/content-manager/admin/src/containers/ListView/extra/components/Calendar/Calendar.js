/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Calendar as BigCalendar,
  CalendarProps,
  dateFnsLocalizer,
  Event,
  NavigateAction,
  View,
} from "react-big-calendar";
import endOfMonth from "date-fns/endOfMonth";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import zhTWLocale from "date-fns/locale/zh-TW";
import parse from "date-fns/parse";
import startOfMonth from "date-fns/startOfMonth";
import startOfWeek from "date-fns/startOfWeek";

const locales = {
  // 'en-US': require('date-fns/locale/en-US'),
  "zh-TW": {
    ...zhTWLocale,
    options: {
      weekStartsOn: 0,
    },
  },
};

const _localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const _messages = {
  date: "日子",
  time: "時間",
  event: "事件",
  allDay: "全日",
  week: "週",
  work_week: "工作週",
  day: "日",
  month: "月",
  previous: "前一範圍",
  next: "後一範圍",
  yesterday: "昨天",
  tomorrow: "明天",
  today: "今天",
  agenda: "日程",

  noEventsInRange: "這範圍內沒有事件。",

  showMore: (total) => `+${total} 項更多`,
};

const Calendar = ({ events, onNavigate, onMonthChange, ...others }) => {
  const [oldDate, setOldDate] = useState(null);

  const handleNavigate = (newDate, view, action) => {
    if (onNavigate) {
      onNavigate(newDate, view, action);
    }
    if (onMonthChange) {
      if (
        oldDate === null ||
        newDate.getFullYear() !== oldDate.getFullYear() ||
        newDate.getMonth() !== oldDate.getMonth()
      ) {
        onMonthChange({
          start: startOfMonth(newDate),
          end: endOfMonth(newDate),
        });
        setOldDate(newDate);
      }
    }
  };

  useEffect(() => {
    handleNavigate(new Date(), "month", "TODAY");
  }, []);

  return (
    <div>
      <BigCalendar
        localizer={_localizer}
        messages={_messages}
        culture="zh-TW"
        events={events || []}
        onNavigate={handleNavigate}
        {...others}
      />
    </div>
  );
};

export default Calendar;
