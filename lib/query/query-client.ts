import { MutationCache, QueryCache, QueryClient, type DefaultOptions } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { getErrorMessage } from "@/lib/api/errors";

const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 0,
  },
};

function notifyQueryError(error: unknown) {
  toast.error(getErrorMessage(error));
}

export function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: notifyQueryError,
    }),
    mutationCache: new MutationCache({
      onError: notifyQueryError,
    }),
    defaultOptions,
  });
}
