"use client";

import { FC } from "react";
import { motion } from "framer-motion";

interface UptimeChartProps {
  apiHealthy: boolean;
  theme: string;
}

/**
 * Uptime chart component
 * Displays a GitHub-style contribution graph showing 90 days of system uptime history
 * with color-coded status indicators and interactive tooltips
 */
export const UptimeChart: FC<UptimeChartProps> = ({ theme }) => {
  /**
   * Generate last 90 days of uptime data organized by weeks
   */
  const generateUptimeData = () => {
    const data = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 89); // 90 days ago

    // Find the start of the week (Sunday) for the first week
    const firstWeekStart = new Date(startDate);
    firstWeekStart.setDate(firstWeekStart.getDate() - firstWeekStart.getDay());

    for (let i = 0; i < 90; i++) {
      const date = new Date(firstWeekStart);
      date.setDate(date.getDate() + i);

      // Don't include future dates
      if (date > today) break;

      // Simulate mostly good uptime with occasional issues
      const uptime = Math.random() > 0.05 ? 100 : Math.random() * 100;

      data.push({
        date: date,
        dateString: date.toISOString().split("T")[0],
        uptime: uptime,
        status:
          uptime > 99
            ? "excellent"
            : uptime > 95
              ? "good"
              : uptime > 90
                ? "poor"
                : "critical",
        dayOfWeek: date.getDay(),
        weekIndex: Math.floor(i / 7),
      });
    }

    return data;
  };

  const uptimeData = generateUptimeData();
  const averageUptime =
    uptimeData.reduce((sum, day) => sum + day.uptime, 0) / uptimeData.length;

  /**
   * Organize uptime data into weeks structure for GitHub-style grid
   */
  const organizeIntoWeeks = () => {
    const weeks: Array<Array<(typeof uptimeData)[0] | null>> = [];
    const maxWeeks = Math.ceil(uptimeData.length / 7);

    for (let week = 0; week < maxWeeks; week++) {
      const weekData: Array<(typeof uptimeData)[0] | null> = new Array(7).fill(
        null
      );

      for (let day = 0; day < 7; day++) {
        const dataIndex = week * 7 + day;
        if (dataIndex < uptimeData.length) {
          const dayData = uptimeData[dataIndex];
          if (dayData) {
            weekData[dayData.dayOfWeek] = dayData;
          }
        }
      }

      weeks.push(weekData);
    }

    return weeks;
  };

  const weeklyData = organizeIntoWeeks();
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  /**
   * Get color class for uptime status
   */
  const getStatusColor = (status: string | undefined) => {
    if (!status) return theme === "dark" ? "bg-gray-800" : "bg-gray-100";

    switch (status) {
      case "excellent":
        return "bg-green-500";
      case "good":
        return "bg-yellow-500";
      case "poor":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return theme === "dark" ? "bg-gray-700" : "bg-gray-200";
    }
  };

  /**
   * Format tooltip text for uptime data
   */
  const formatTooltip = (day: (typeof uptimeData)[0] | null) => {
    if (!day) return "No data";
    return `${day.date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })}: ${day.uptime.toFixed(1)}% uptime`;
  };

  return (
    <div
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3
          className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          90-Day Uptime History
        </h3>
        <div className="text-right">
          <p className={`text-2xl font-bold text-green-500`}>
            {averageUptime.toFixed(2)}%
          </p>
          <p
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            Average Uptime
          </p>
        </div>
      </div>

      {/* GitHub-style contribution graph */}
      <div className="mb-4">
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col justify-start mr-3">
            {dayLabels.map((day, index) => (
              <div
                key={day}
                className={`h-3 flex items-center text-xs mb-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
                style={{
                  opacity: index % 2 === 0 ? 1 : 0, // Show only every other day label to avoid crowding
                }}
              >
                {index % 2 === 0 ? day : ""}
              </div>
            ))}
          </div>

          {/* Uptime grid */}
          <div className="flex gap-1 overflow-x-auto">
            {weeklyData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (weekIndex * 7 + dayIndex) * 0.003 }}
                    className={`w-3 h-3 rounded-sm ${getStatusColor(day?.status)} cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50 transition-all`}
                    title={formatTooltip(day)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Month labels */}
      <div className="flex justify-start ml-16 mb-4">
        <div className="flex gap-1">
          {Array.from(
            { length: Math.ceil(weeklyData.length / 4) },
            (_, monthIndex) => {
              const weekIndex = monthIndex * 4;
              if (weekIndex < weeklyData.length) {
                const firstDayOfMonth = uptimeData[weekIndex * 7]?.date;
                if (firstDayOfMonth) {
                  return (
                    <div
                      key={monthIndex}
                      className={`text-xs w-16 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {firstDayOfMonth.toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </div>
                  );
                }
              }
              return null;
            }
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs">
        <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
          Less
        </span>

        <div className="flex items-center space-x-1">
          {["excellent", "good", "poor", "critical"].map((status) => (
            <div
              key={status}
              className={`w-3 h-3 rounded-sm ${getStatusColor(status)}`}
              title={`${status} uptime`}
            />
          ))}
        </div>

        <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
          More
        </span>
      </div>

      {/* Legend labels */}
      <div className="flex items-center justify-center space-x-4 mt-2 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <span
            className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
          >
            99%+
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-sm bg-yellow-500" />
          <span
            className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
          >
            95-99%
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-sm bg-orange-500" />
          <span
            className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
          >
            90-95%
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          <span
            className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
          >
            &lt;90%
          </span>
        </div>
      </div>
    </div>
  );
};
