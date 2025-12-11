"use client";

import {
  FormEvent,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import UrlShortener, { type ApiScope } from "@/app/lib/api";
import getToken, { clearToken } from "@/app/lib/getToken";

export type ApiKeyItem = {
  id: string;
  name: string;
  scopes: ApiScope[];
  createdAt: string;
};

type ApiKeysState = {
  apiKeys: ApiKeyItem[];
  loading: boolean;
  error?: string;
  createOpen: boolean;
  setCreateOpen: (value: boolean) => void;
  nameInput: string;
  setNameInput: (value: string) => void;
  selectedScopes: ApiScope[];
  toggleScope: (scope: ApiScope) => void;
  creating: boolean;
  handleCreate: (ev: FormEvent<HTMLFormElement>) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  newToken?: string | null;
  clearNewToken: () => void;
};

const ApiKeysContext = createContext<ApiKeysState | null>(null);

function useApiKeysState(): ApiKeysState {
  const [token, setToken] = useState<string | undefined>();
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const [createOpen, setCreateOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<ApiScope[]>([
    "READ_LINKS",
  ]);
  const [creating, setCreating] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);

  const makeApi = (overrideToken?: string) =>
    new UrlShortener({
      token: overrideToken ?? token,
      onUnauthorized: async () => {
        await clearToken();
        setToken(undefined);
      },
    });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(undefined);
      const nextToken = await getToken();
      if (cancelled) return;
      if (!nextToken) {
        setError("Token not found.");
        setLoading(false);
        return;
      }
      setToken(nextToken);

      const res = await makeApi(nextToken).listApiKeys();
      if (cancelled) return;

      if (!res?.apiKeys) {
        setError(
          typeof res?.message === "string"
            ? res.message
            : "Could not load API keys.",
        );
      } else {
        setApiKeys(res.apiKeys);
      }

      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(undefined);
    const nextToken = token ?? (await getToken());
    if (!nextToken) {
      setError("Token not found.");
      setLoading(false);
      return;
    }
    setToken(nextToken);

    const res = await makeApi(nextToken).listApiKeys();

    if (!res?.apiKeys) {
      setError(
        typeof res?.message === "string"
          ? res.message
          : "Could not load API keys.",
      );
    } else {
      setApiKeys(res.apiKeys);
    }

    setLoading(false);
  };

  const toggleScope = (scope: ApiScope) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  const handleCreate = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setCreating(true);
    setError(undefined);

    const authToken = token ?? (await getToken());
    if (!authToken) {
      setError("Token not found.");
      setCreating(false);
      return;
    }
    setToken(authToken);

    const res = await makeApi(authToken).createApiKey({
      name: nameInput,
      scopes: selectedScopes,
    });

    setCreating(false);

    if (!res?.token) {
      setError(
        typeof res?.message === "string"
          ? res.message
          : "Error trying to create.",
      );
      return;
    }

    setApiKeys((prev) => [res.created, ...prev]);
    setNewToken(res.token);
    setNameInput("");
    setSelectedScopes(["READ_LINKS"]);
    setCreateOpen(false);
  };

  const handleDelete = async (id: string) => {
    const previous = apiKeys;
    setApiKeys((prev) => prev.filter((key) => key.id !== id));
    const authToken = token ?? (await getToken());
    if (!authToken) {
      setError("Token not found.");
      setApiKeys(previous);
      return;
    }
    setToken(authToken);

    const res = await makeApi(authToken).deleteApiKey(id);
    if (res?.message) {
      setError(res.message);
      setApiKeys(previous);
    }
  };

  return {
    apiKeys,
    loading,
    error,
    createOpen,
    setCreateOpen,
    nameInput,
    setNameInput,
    selectedScopes,
    toggleScope,
    creating,
    handleCreate,
    handleDelete,
    refresh,
    newToken,
    clearNewToken: () => setNewToken(null),
  };
}

export function ApiKeysProvider({ children }: { children: ReactNode }) {
  const apiKeys = useApiKeysState();
  return (
    <ApiKeysContext.Provider value={apiKeys}>
      {children}
    </ApiKeysContext.Provider>
  );
}

export function useApiKeys() {
  const ctx = useContext(ApiKeysContext);
  if (!ctx) {
    throw new Error("useApiKeys must be used inside ApiKeysProvider");
  }
  return ctx;
}

export default useApiKeys;
