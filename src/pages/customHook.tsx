import omitBy from "lodash/omitBy";
import isUndefined from "lodash/isUndefined";
import { useSearchParams } from "react-router-dom";

export default function useQueryParams() {
  const [searchParams] = useSearchParams();
  return Object.fromEntries([...searchParams]);
}
export interface ProductListConfig {
  vouche?: string;
}
export type QueryConfig = {
  [key in keyof ProductListConfig]: string;
};
export function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      vouche: queryParams.vouche
    },
    isUndefined
  );
  return queryConfig;
}
