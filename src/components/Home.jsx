import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="page-shell">
      <section className="card auth-card">
        <div className="card-header">
          <h1>Profile Management</h1>
          <p>Welcome. Login to update your profile details and image securely.</p>
        </div>

        <div className="button-row">
          <Link to="/login" className="btn-primary">
            Go to Login
          </Link>
          <Link to="/profile" className="btn-subtle">
            Go to Profile
          </Link>
        </div>
      </section>
    </main>
  );
}
