import React from "react";
import FailedToFetch from "./FailedToFetch";
import { useColors } from "@/components/General/(Color Manager)/useColors";

function LeetCodeCard({ url, data }: { url: string; data: any }) {
  const colors = useColors();

  if (!data)
    return (
      <FailedToFetch
        message={"Failed to fetch Data"}
        onRetry={() => window.location.replace(new URL(url))}
      />
    );

  const {
    user,
    languagesSolved,
    contestStats,
    badges,
    contestHistory,
    activity,
  } = data;

  return (
    <div
      className={`max-w-4xl mx-auto shadow-lg rounded-2xl p-6 space-y-6 
      ${colors.background.primary} ${colors.text.primary}`}
    >
      {/* Profile */}
      <div className="flex items-center gap-4">
        <img
          src={user.avatar}
          alt={user.username}
          className={`w-16 h-16 rounded-full ${colors.border.fadedThin}`}
        />

        <div>
          <h2 className="text-xl font-bold">{user.realName}</h2>
          <p className={`${colors.text.secondary}`}>@{user.username}</p>
          <p className={`text-sm ${colors.text.secondary}`}>
            Global Rank: {user.ranking}
          </p>
        </div>
      </div>

      {/* Contest Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <Stat label="Rating" value={contestStats.rating} />
        <Stat label="Contests" value={contestStats.attendedContests} />
        <Stat label="Global Rank" value={contestStats.globalRanking} />
        <Stat label="Top %" value={contestStats.topPercentage} />
      </div>

      {/* Languages */}
      <Section title="Languages Solved">
        <div className="flex flex-wrap gap-2">
          {Object.entries(languagesSolved).map(([lang, count]) => (
            <span
              key={lang}
              className={`px-3 py-1 rounded-lg text-sm 
              ${colors.background.secondary} ${colors.text.primary}`}
            >
              {lang}: {languagesSolved[lang] || 0}
            </span>
          ))}
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges">
        <div className="flex flex-wrap gap-3">
          {badges.map((b: any, i: number) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-lg text-sm 
              ${colors.background.accent} ${colors.text.primary}`}
            >
              🏅 {b.name}
            </div>
          ))}
        </div>
      </Section>

      {/* Activity */}
      <Section title="Activity">
        <div className={`flex gap-6 text-sm ${colors.text.secondary}`}>
          <div>🔥 Streak: {activity.streak}</div>
          <div>📅 Active Days: {activity.totalActiveDays}</div>
          <div>🗓 Years: {activity.activeYears.join(", ")}</div>
        </div>
      </Section>

      {/* Contest History */}
      <Section title="Recent Contests">
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${colors.border.fadedThin}`}>
            <thead className={`${colors.background.secondary}`}>
              <tr>
                <th className="p-2 text-left">Contest</th>
                <th className="p-2">Solved</th>
                <th className="p-2">Rank</th>
                <th className="p-2">Rating</th>
              </tr>
            </thead>

            <tbody>
              {contestHistory.slice(-5).map((c: any, i: number) => (
                <tr key={i} className={`${colors.border.fadedThinTop}`}>
                  <td className="p-2">{c.contestName}</td>

                  <td className="text-center">
                    {c.problemsSolved}/{c.totalProblems}
                  </td>

                  <td className="text-center">{c.ranking}</td>

                  <td
                    className={`text-center ${c.trend === "UP"
                      ? "text-green-500"
                      : "text-red-500"
                      }`}
                  >
                    {c.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: any) {
  const colors = useColors();

  return (
    <div>
      <h3 className={`text-lg font-semibold mb-2 ${colors.text.primary}`}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Stat({ label, value }: any) {
  const colors = useColors();

  return (
    <div
      className={`rounded-lg p-3 
      ${colors.background.secondary} ${colors.text.primary}`}
    >
      <div className="text-lg font-semibold">{value}</div>
      <div className={`text-xs ${colors.text.secondary}`}>{label}</div>
    </div>
  );
}

export default LeetCodeCard;