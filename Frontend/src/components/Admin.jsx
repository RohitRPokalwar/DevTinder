import axios from "axios";
import React, { useEffect, useState } from "react";

function Admin() {
  const [settings, setSettings] = useState({
    emailEnabled: true,
    dailyDigestEnabled: true,
    connectionNotificationsEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("/api/admin/settings", {
        withCredentials: true,
      });
      setSettings(res.data);
    } catch (err) {
      setErrorMessage(err.response?.data || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key) => {
    try {
      setErrorMessage("");
      const updated = { ...settings, [key]: !settings[key] };
      setSettings(updated);
      await axios.put("/api/admin/settings", updated, {
        withCredentials: true,
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data || "Failed to update settings");
      fetchSettings();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl">Admin Panel</h2>

          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
              <div>
                <p className="font-semibold">Email Notifications</p>
                <p className="text-xs opacity-60">Master toggle for all emails</p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.emailEnabled}
                onChange={() => handleToggle("emailEnabled")}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
              <div>
                <p className="font-semibold">Daily Digest</p>
                <p className="text-xs opacity-60">Send daily summary emails</p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.dailyDigestEnabled}
                onChange={() => handleToggle("dailyDigestEnabled")}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
              <div>
                <p className="font-semibold">Connection Notifications</p>
                <p className="text-xs opacity-60">Notify on requests & accepts</p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.connectionNotificationsEnabled}
                onChange={() => handleToggle("connectionNotificationsEnabled")}
              />
            </div>
          </div>

          {errorMessage && <p className="text-red-500 mt-3">{errorMessage}</p>}
        </div>
      </div>

      {showToast && (
        <div className="toast toast-bottom toast-end">
          <div className="alert alert-success">
            <span>Settings saved!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
