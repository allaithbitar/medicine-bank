import { useNavigate, useSearchParams } from "react-router-dom";

const useUrlToggleState = (key: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const value = searchParams.get(key) === "1";

  const toggleValue = () => {
    const isValueAlreadyExist = searchParams.get(key) === "1";
    if (isValueAlreadyExist) {
      navigate(-1);
    } else {
      setSearchParams({ [key]: "1" });
    }
  };

  return { value, toggleValue };
};

export default useUrlToggleState;
