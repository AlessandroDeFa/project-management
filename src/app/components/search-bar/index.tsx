import { useEffect, useState } from "react";
import { RemoveIcon, SearchIcon } from "../svgs";
import styles from "./style.module.css";
import { getResultsFromQuery } from "@/app/utils/apiService";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { updateSearchValues } from "@/redux/features/queryValues-slice";
import { AllElements } from "@/app/utils/dataTypes";
import { usePathname, useRouter } from "next/navigation";
import CircularProgress from "../circularProgress";

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { values } = useAppSelector((state) => state.queryValuesReducer.value);
  const router = useRouter();
  const currentPath = usePathname();

  const actionDispatch = (res: AllElements[]) => {
    return (dispatch: AppDispatch) => {
      return new Promise<void>((resolve, reject) => {
        dispatch(updateSearchValues({ query: query, values: res }));
        resolve();
      });
    };
  };

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.length !== 0) {
        setIsSearching(true);
        const res = await getResultsFromQuery(query);
        await dispatch(actionDispatch(res));
        setIsSearching(false);
      } else if (currentPath === "/search") {
        router.back();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (values) {
      if (currentPath !== "/search") {
        router.push(`/search?q=${query}`);
      }
    }
  }, [values]);

  return (
    <div className={styles.container}>
      <span>
        <SearchIcon className={styles.icon} />
      </span>
      <input
        type="text"
        value={query}
        className={styles.input}
        placeholder="Cerca"
        onChange={(e) => setQuery(e.target.value)}
      />
      {isSearching && (
        <CircularProgress
          size={{
            width: 16,
            height: 16,
          }}
        />
      )}

      {query.length > 0 && (
        <button onClick={() => setQuery("")}>
          <RemoveIcon className={styles.icon} />
        </button>
      )}
    </div>
  );
}
