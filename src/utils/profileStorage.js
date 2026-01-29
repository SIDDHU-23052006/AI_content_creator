const PROFILE_KEY = "userProfile";

export function getProfile() {
  const stored = localStorage.getItem(PROFILE_KEY);
  return stored
    ? JSON.parse(stored)
    : {
        tone: "Professional",
        industry: "",
        style: "",
      };
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
