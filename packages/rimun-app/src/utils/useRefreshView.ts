import { useNavigate } from "react-router-dom";

export default function useRefreshView() {
  const navigate = useNavigate();
  return () => {
    navigate("/temp");
    navigate(-1);
  };
}
