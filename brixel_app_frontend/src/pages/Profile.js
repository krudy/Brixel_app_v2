import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:9999/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUser);
  }, [token]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {user.email}</p>
      <p>Created at: {new Date(user.createdAt).toLocaleString()}</p>
    </div>
  );
}

export default Profile;
