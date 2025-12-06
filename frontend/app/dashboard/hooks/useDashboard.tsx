import {
  useState,
  useEffect,
  FormEvent,
  createContext,
  useContext,
  ReactNode,
} from "react";
import UrlShortener from "@/app/lib/api";
import getToken, { clearToken } from "@/app/lib/getToken";

export type LinkItem = {
  id?: string;
  slug: string;
  redirect?: string;
  target?: string;
};

export type Stats = {
  id: string;
  slug: string;
  clicks: string;
  uniqueClicks: string;
  lastClickAt: string;
};

type DashboardState = {
  links: LinkItem[];
  loading: boolean;
  error?: string;
  createOpen: boolean;
  setCreateOpen: (value: boolean) => void;
  createInput: string;
  setCreateInput: (value: string) => void;
  creating: boolean;
  statsOpen: boolean;
  setStatsOpen: (value: boolean) => void;
  statsData: Stats | null;
  statsSlug: string | null;
  statsLoading: boolean;
  statsError?: string;
  handleCreate: (ev: FormEvent<HTMLFormElement>) => Promise<void>;
  handleDelete: (slug: string) => Promise<void>;
  handleStats: (slug: string) => Promise<void>;
};

const DashboardContext = createContext<DashboardState | null>(null);

function useDashboardState(): DashboardState {
  const [token, setToken] = useState<string | undefined>();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const [createOpen, setCreateOpen] = useState(false);
  const [createInput, setCreateInput] = useState("");
  const [creating, setCreating] = useState(false);

  const [statsOpen, setStatsOpen] = useState(false);
  const [statsData, setStatsData] = useState<Stats | null>(null);
  const [statsSlug, setStatsSlug] = useState<string | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | undefined>();

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
      if (!nextToken) {
        setError("Token not found.");
        setLoading(false);
        return;
      }
      if (cancelled) return;
      setToken(nextToken);

      const data = await makeApi(nextToken).listMyLinks();
      if (cancelled) return;

      if (!data || data.message) {
        setError(
          typeof data?.message === "string"
            ? data.message
            : "Failed on loading links.",
        );
      } else {
        const mapped: LinkItem[] = data.list.map(
          (item: { slug: string; redirect: string }) => ({
            slug: item.slug,
            redirect: item.redirect,
          }),
        );
        setLinks(mapped);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setCreating(true);
    setError(undefined);

    const { slug, message } = await makeApi().createShortUrl(createInput);

    setCreating(false);

    if (!slug) {
      setError(message ?? "Error trying to create.");
      return;
    }

    const newLink: LinkItem = {
      slug,
      redirect: createInput,
    };

    setLinks((prev) => [newLink, ...prev]);
    setCreateInput("");
    setCreateOpen(false);
  };

  const handleDelete = async (slug: string) => {
    const previous = links;
    setLinks((prev) => prev.filter((item) => item.slug !== slug));
    const res = await makeApi().deleteMyLink(slug);
    if (res?.message) {
      setError(res.message);
      setLinks(previous);
    }
  };

  const handleStats = async (slug: string) => {
    setStatsOpen(true);
    setStatsSlug(slug);
    setStatsLoading(true);
    setStatsError(undefined);
    setStatsData(null);

    const res = await makeApi().getUrlStats(slug);
    if (res?.message && !res.stats) {
      setStatsError(res.message);
    } else {
      setStatsData(res);
    }
    setStatsLoading(false);
  };

  return {
    links,
    loading,
    error,
    createOpen,
    setCreateOpen: (value: boolean) => setCreateOpen(value),
    createInput,
    setCreateInput: (value: string) => setCreateInput(value),
    creating,
    statsOpen,
    setStatsOpen: (value: boolean) => setStatsOpen(value),
    statsData,
    statsSlug,
    statsLoading,
    statsError,
    handleCreate,
    handleDelete,
    handleStats,
  };
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const dashboard = useDashboardState();
  return (
    <DashboardContext.Provider value={dashboard}>
      {children}
    </DashboardContext.Provider>
  );
}

export default function useDashboardContext() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error(
      "useDashboardContext must be used inside DashboardProvider",
    );
  }
  return ctx;
}

export { useDashboardContext };
