"use client";
import { FiltersQueryType } from "@/types/product";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FiltersHeader({
  queries,
}: {
  queries: FiltersQueryType;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [currentParams, setCurrentParams] = useState<string>(
    searchParams.toString()
  );

  useEffect(() => {
    setCurrentParams(searchParams.toString());
  }, [searchParams]);

  // Destructure queries into an array format
  const queriesArray = Object.entries(queries);
  const queriesLength = queriesArray.reduce((count, [queryKey, queryValue]) => {
    if (queryKey === "sort") return count;
    return count + (Array.isArray(queryValue) ? queryValue.length : 1);
  }, 0);

  const handleClearQueries = () => {
    const params = new URLSearchParams(searchParams);
    params.forEach((_, key) => {
      params.delete(key);
    });
    replace(pathname);
  };

  const handleRemoveQuery = (
    query: string,
    array?: string[],
    specificValue?: string
  ) => {
    const params = new URLSearchParams(searchParams);

    if (specificValue && array) {
      const updatedArray = array.filter((value) => value !== specificValue);
      params.delete(query);
      updatedArray.forEach((value) => params.append(query, value));
    } else {
      params.delete(query);
    }

    replace(`${pathname}?${params.toString()}`);
    setCurrentParams(params.toString());
  };

  return (
    <div className="pt-2.5 pb-5">
      <div className="flex items-center justify-between h-4 leading-5">
        <div className="text-sm font-bold">Filter ({queriesLength})</div>
        {queriesLength > 0 && (
          <div
            className="text-xs text-orange-background cursor-pointer hover:underline"
            onClick={handleClearQueries}
          >
            Clear All
          </div>
        )}
      </div>
      {/* Display filters */}
      <div className="mt-3 flex flex-wrap gap-2">
        {queriesArray.map(([queryKey, queryValue]) => {
          if (queryKey === "sort") return null;

          const isArrayQuery = Array.isArray(queryValue);
          const queryValues = isArrayQuery ? queryValue : [queryValue];

          // Filter out non-string values and ensure we only render strings
          const validValues = queryValues.filter(
            (val) => typeof val === "string" || typeof val === "number"
          );

          if (validValues.length === 0) return null;

          return (
            <div key={queryKey} className="flex flex-wrap gap-2">
              {validValues.map((value, index) => (
                <div
                  key={`${queryKey}-${index}`}
                  className="border cursor-pointer py-0.5 px-1.5 rounded-sm text-sm w-fit text-center"
                >
                  <span className="text-main-secondary overflow-hidden text-ellipsis whitespace-nowrap mr-2">
                    {String(value)} {/* Safely convert to string */}
                  </span>
                  <X
                    className="w-3 text-main-secondary hover:text-black cursor-pointer inline-block"
                    onClick={() => {
                      isArrayQuery
                        ? handleRemoveQuery(
                            queryKey,
                            queryValues as string[],
                            String(value)
                          )
                        : handleRemoveQuery(queryKey);
                    }}
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
