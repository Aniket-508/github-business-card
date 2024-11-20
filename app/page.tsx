/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GithubCard } from "@/components/github-card";
import { CardActions } from "@/components/card-actions";
import { ModeToggle } from "@/components/mode-toggle";
import { fetchUserStats, getUserUrl } from "@/lib/github";

function Home() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const fetchGithubUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter a GitHub username");
      return;
    }

    setLoading(true);
    try {
      const [userResponse, statsData] = await Promise.all([
        fetch(getUserUrl(username)),
        fetchUserStats(username),
      ]);

      if (!userResponse.ok) {
        throw new Error("User not found");
      }

      const userData = await userResponse.json();
      setUserData(userData);
      setStatsData(statsData);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch user data");
      setUserData(null);
      setStatsData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-200 py-12 px-4">
      <div className="fixed top-4 right-4">
        <ModeToggle />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl font-bold">GitHub Business Card</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate a professional business card of your GitHub profile
          </p>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <Link
              href="https://aniket-pawar.vercel.app/"
              target="_blank"
              className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              made by aniket
            </Link>
            <span className="mx-2">|</span>
            <Link
              href="https://buymeacoffee.com/aniketpawar508"
              target="_blank"
              className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              buy aniket a coffee
            </Link>
          </div>
        </div>

        <form onSubmit={fetchGithubUser} className="max-w-md mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
              className="w-full bg-white dark:bg-gray-900 pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent shadow-sm"
            />
            <Button
              disabled={loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 "
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </form>

        {userData && statsData && (
          <>
            <p className="block sm:hidden text-sm text-center text-gray-600 dark:text-gray-400 mb-2">
              (Best viewed on desktop)
            </p>

            <div className="flex justify-center">
              <div className="overflow-x-auto">
                <GithubCard
                  ref={cardRef}
                  user={userData}
                  stats={statsData.stats}
                  languages={statsData.languages}
                />
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <CardActions cardRef={cardRef} username={userData.login} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
