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
import ErrorDialog from "../errorMessage";

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [errorDialog, setErrorDialog] = useState<boolean>(false);
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
        try {
          setIsSearching(true);
          const res = await getResultsFromQuery(query);
          await dispatch(actionDispatch(res));
        } catch (error) {
          console.error(error);
          setErrorDialog(true);
        }

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
        const encodedQuery = encodeURIComponent(query);
        router.push(`/search?q=${encodedQuery}`);
      }
    }
  }, [values]);

  return (
    <div className={styles.container}>
      <ErrorDialog setOpen={setErrorDialog} open={errorDialog} />

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
