import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, saveProfile } from "../utils/profileStorage";
import { User } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    tone: "Professional",
    industry: "",
    style: "",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = getProfile();
    if (stored) setProfile(stored);
  }, []);

  const handleSave = () => {
    saveProfile(profile);
    setSaved(true);

    // ✅ Professional auto-redirect to Home
    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-white flex items-center justify-center px-6">
      <div
        className="
          w-full max-w-xl
          bg-white dark:bg-black/70
          backdrop-blur-xl
          border border-black/10 dark:border-white/10
          rounded-2xl
          shadow-[0_30px_80px_rgba(0,0,0,0.35)]
          p-8
        "
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center">
            <User size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Profile Preferences</h1>
            <p className="text-sm text-gray-500 dark:text-white/50">
              Customize how your content is generated
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="space-y-6">
          {/* TONE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Default Tone
            </label>
            <select
              value={profile.tone}
              onChange={(e) =>
                setProfile({ ...profile, tone: e.target.value })
              }
              className="
                w-full px-4 py-3 rounded-xl
                bg-gray-100 dark:bg-zinc-900
                border border-black/10 dark:border-white/10
                focus:outline-none focus:ring-2 focus:ring-purple-500
              "
            >
              <option>Professional</option>
              <option>Casual</option>
              <option>Friendly</option>
              <option>Persuasive</option>
            </select>
          </div>

          {/* INDUSTRY */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Industry
            </label>
            <input
              value={profile.industry}
              onChange={(e) =>
                setProfile({ ...profile, industry: e.target.value })
              }
              placeholder="Education, IT, Marketing, Healthcare..."
              className="
                w-full px-4 py-3 rounded-xl
                bg-gray-100 dark:bg-zinc-900
                border border-black/10 dark:border-white/10
                placeholder-gray-400 dark:placeholder-white/40
                focus:outline-none focus:ring-2 focus:ring-purple-500
              "
            />
          </div>

          {/* STYLE */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Writing Style
            </label>
            <input
              value={profile.style}
              onChange={(e) =>
                setProfile({ ...profile, style: e.target.value })
              }
              placeholder="Clear, Storytelling, Technical, Bold..."
              className="
                w-full px-4 py-3 rounded-xl
                bg-gray-100 dark:bg-zinc-900
                border border-black/10 dark:border-white/10
                placeholder-gray-400 dark:placeholder-white/40
                focus:outline-none focus:ring-2 focus:ring-purple-500
              "
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          className="
            w-full mt-8
            bg-purple-600 text-white
            py-3 rounded-xl font-medium
            hover:bg-purple-700 hover:scale-[1.02]
            transition
          "
        >
          Save Preferences
        </button>

        {/* SUCCESS MESSAGE */}
        {saved && (
          <p className="mt-4 text-sm text-green-500 text-center">
            Preferences saved. Redirecting…
          </p>
        )}
      </div>
    </div>
  );
}
