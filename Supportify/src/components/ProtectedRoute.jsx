
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFrappeAuth, useFrappeCreateDoc, useFrappeGetDoc, useFrappeGetDocList } from 'frappe-react-sdk';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { currentUser } = useFrappeAuth();

  const { data, error } = useFrappeGetDocList("Agent Profile", {filters : { "user": currentUser }});

  console.log("currentUser", currentUser);
  console.log("data", data);
  console.log("error", error);

  // if (data && data.length === 0 && currentUser) {
  //   useFrappeCreateDoc("Agent Profile", { "user": currentUser });
  // }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
