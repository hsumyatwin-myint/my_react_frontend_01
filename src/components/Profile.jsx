import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import API_BASE from "../lib/apiBase";

const initialProfile = {
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  profileImage: null,
};

export default function Profile() {
  const { logout } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);
  const API_URL = API_BASE;

  async function fetchProfile() {
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        credentials: "include",
      });

      if (response.status === 401) {
        logout();
        return;
      }

      const payload = await response.json();
      if (!response.ok) {
        setErrorMessage(payload.message || "Failed to load profile.");
        return;
      }

      setProfile({
        id: payload.id || "",
        firstname: payload.firstname || "",
        lastname: payload.lastname || "",
        email: payload.email || "",
        profileImage: payload.profileImage || null,
      });
    } catch {
      setErrorMessage("Failed to load profile.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  async function onSaveProfile(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstname: profile.firstname,
          lastname: profile.lastname,
          email: profile.email,
        }),
      });

      if (response.status === 401) {
        logout();
        return;
      }

      const payload = await response.json();
      if (!response.ok) {
        setErrorMessage(payload.message || "Failed to update profile.");
        return;
      }

      setProfile((prev) => ({
        ...prev,
        firstname: payload.firstname || "",
        lastname: payload.lastname || "",
        email: payload.email || "",
      }));
      setSuccessMessage("Profile updated successfully.");
    } catch {
      setErrorMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  async function onUpdateImage() {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      setErrorMessage("Please select an image file.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Only image files are allowed.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.status === 401) {
        logout();
        return;
      }

      const payload = await response.json();
      if (!response.ok) {
        setErrorMessage(payload.message || "Failed to upload image.");
        return;
      }

      setProfile((prev) => ({ ...prev, profileImage: payload.imageUrl }));
      setSuccessMessage("Profile image updated.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      setErrorMessage("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  }

  async function onRemoveImage() {
    setErrorMessage("");
    setSuccessMessage("");
    setIsUploading(true);

    try {
      const response = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 401) {
        logout();
        return;
      }

      const payload = await response.json();
      if (!response.ok) {
        setErrorMessage(payload.message || "Failed to remove image.");
        return;
      }

      setProfile((prev) => ({ ...prev, profileImage: null }));
      setSuccessMessage("Profile image removed.");
    } catch {
      setErrorMessage("Failed to remove image.");
    } finally {
      setIsUploading(false);
    }
  }

  if (isLoading) {
    return (
      <main className="page-shell">
        <section className="card profile-card">
          <h2>Loading profile...</h2>
        </section>
      </main>
    );
  }

  const initials = `${profile.firstname?.[0] || ""}${profile.lastname?.[0] || ""}`.toUpperCase();

  return (
    <main className="page-shell">
      <section className="card profile-card">
        <div className="card-header profile-header">
          <div>
            <h1>User Profile</h1>
            <p>Manage your personal information and profile image.</p>
          </div>
          <Link className="btn-subtle" to="/logout">
            Logout
          </Link>
        </div>

        {errorMessage && <div className="alert error">{errorMessage}</div>}
        {successMessage && <div className="alert success">{successMessage}</div>}

        <div className="profile-layout">
          <aside className="image-panel">
            <div className="avatar-wrap">
              {profile.profileImage ? (
                <img
                  src={`${API_URL}${profile.profileImage}`}
                  alt="Profile"
                  className="avatar-img"
                />
              ) : (
                <div className="avatar-fallback">{initials || "U"}</div>
              )}
            </div>
            <p className="hint">PNG, JPG, GIF or WEBP. Max size depends on server limits.</p>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/gif,image/webp"
            />
            <div className="button-row">
              <button
                type="button"
                className="btn-primary"
                onClick={onUpdateImage}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Image"}
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={onRemoveImage}
                disabled={isUploading || !profile.profileImage}
              >
                Remove Image
              </button>
            </div>
          </aside>

          <form className="form-grid" onSubmit={onSaveProfile}>
            <label htmlFor="profile-id">ID</label>
            <input id="profile-id" value={profile.id} disabled />

            <label htmlFor="profile-firstname">First Name</label>
            <input
              id="profile-firstname"
              value={profile.firstname}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, firstname: event.target.value }))
              }
              required
            />

            <label htmlFor="profile-lastname">Last Name</label>
            <input
              id="profile-lastname"
              value={profile.lastname}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, lastname: event.target.value }))
              }
              required
            />

            <label htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              type="email"
              value={profile.email}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, email: event.target.value }))
              }
              required
            />

            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
