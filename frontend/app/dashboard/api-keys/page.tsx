"use client";

import { useState } from "react";
import { ApiScope } from "@/app/lib/api";
import {
  ApiKeysProvider,
  useApiKeys,
  type ApiKeyItem,
} from "../hooks/useApiKeys";
import {
  Check,
  Copy,
  KeyRound,
  Loader2,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

const scopeCopy: Record<ApiScope, { label: string; helper: string }> = {
  READ_LINKS: {
    label: "Read",
    helper: "Allows listing and reading existing links.",
  },
  WRITE_LINKS: {
    label: "Write",
    helper: "Allows creating, editing, or deleting links.",
  },
};

export default function ApiKeysPage() {
  return (
    <ApiKeysProvider>
      <ApiKeysContent />
      <CreateKeyModal />
    </ApiKeysProvider>
  );
}

function ApiKeysContent() {
  const {
    apiKeys,
    loading,
    error,
    setCreateOpen,
    handleDelete,
    refresh,
    newToken,
    clearNewToken,
  } = useApiKeys();
  const [copied, setCopied] = useState(false);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-zinc-400">Manage your API Keys</p>
          <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#ed9c5a] px-4 py-2 text-black font-semibold transition hover:opacity-90 cursor-pointer"
          >
            <Plus className="size-4" />
            Create key
          </button>
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-200 hover:border-zinc-700 transition cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className="size-4" />
          </button>
        </div>
      </div>

      {newToken && (
        <NewTokenCallout
          token={newToken}
          onCopy={() => handleCopy(newToken)}
          onDismiss={clearNewToken}
          copied={copied}
        />
      )}

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-100">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-black/60">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-950 text-zinc-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Scopes</th>
              <th className="px-4 py-3 text-left font-semibold">Created at</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin text-[#ed9c5a]" />
                    Loading keys...
                  </div>
                </td>
              </tr>
            ) : apiKeys.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-zinc-400">
                  No API keys created yet. Generate your first key.
                </td>
              </tr>
            ) : (
              apiKeys.map((key) => (
                <ApiKeyRow
                  key={key.id}
                  item={key}
                  onDelete={() => handleDelete(key.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApiKeyRow({
  item,
  onDelete,
}: {
  item: ApiKeyItem;
  onDelete: () => void;
}) {
  const createdAt = new Date(item.createdAt).toLocaleString();

  return (
    <tr className="border-t border-zinc-900 hover:bg-white/5">
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-zinc-100">{item.name}</span>
          <span className="text-xs text-zinc-500">ID: {item.id}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {item.scopes.length === 0 && (
            <span className="text-xs text-zinc-500">No scopes</span>
          )}
          {item.scopes.map((scope) => (
            <span
              key={scope}
              className="rounded-full border border-[#ed9c5a] bg-[#ed9c5a]/50 px-3 py-1 text-xs text-white"
            >
              {scopeCopy[scope]?.label ?? scope}
            </span>
          ))}
        </div>
      </td>
      <td className="px-4 py-3 text-zinc-300">{createdAt}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={onDelete}
            className="flex items-center justify-center rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-200 hover:border-red-400/70 bg-red-900 cursor-pointer"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function NewTokenCallout({
  token,
  onCopy,
  onDismiss,
  copied,
}: {
  token: string;
  onCopy: () => void;
  onDismiss: () => void;
  copied: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#ed9c5a]/40 bg-[#ed9c5a]/10 px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="size-5 text-[#ed9c5a] mt-1" />
          <div className="space-y-1">
            <p className="text-sm text-[#ed9c5a] font-semibold">
              Copy your new API key now
            </p>
            <p className="text-sm text-amber-50/80">
              The full key only appears once. Store it somewhere safe.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded-lg bg-black/60 px-3 py-2 text-xs text-amber-50 border border-[#ed9c5a]/40">
                {token}
              </code>
              <button
                onClick={onCopy}
                className="flex items-center gap-1 rounded-lg bg-[#ed9c5a] px-3 py-1.5 text-xs font-semibold text-black hover:opacity-90 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="size-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-amber-100 hover:text-white cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

function CreateKeyModal() {
  const {
    createOpen,
    setCreateOpen,
    nameInput,
    setNameInput,
    selectedScopes,
    toggleScope,
    handleCreate,
    creating,
  } = useApiKeys();

  if (!createOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur px-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="size-5 text-[#ed9c5a]" />
            <h2 className="text-xl font-semibold">New API key</h2>
          </div>
          <button
            onClick={() => setCreateOpen(false)}
            className="text-zinc-400 hover:text-white cursor-pointer transition"
          >
            <X />
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleCreate}>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-zinc-300">Display name</span>
            <input
              type="text"
              required
              minLength={3}
              maxLength={64}
              value={nameInput}
              onChange={(ev) => setNameInput(ev.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-[#ed9c5a]"
              placeholder="e.g. internal integration"
            />
          </label>

          <div className="space-y-3">
            <p className="text-sm text-zinc-300">Allowed scopes</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(scopeCopy) as ApiScope[]).map((scope) => {
                const checked = selectedScopes.includes(scope);
                return (
                  <label
                    key={scope}
                    className={`flex cursor-pointer flex-col gap-1 rounded-lg border px-3 py-2 transition ${
                      checked
                        ? "border-[#ed9c5a] bg-[#ed9c5a]/10"
                        : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-zinc-100">
                        {scopeCopy[scope].label}
                      </span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleScope(scope)}
                        className="size-4 accent-[#ed9c5a]"
                      />
                    </div>
                    <span className="text-xs text-zinc-400">
                      {scopeCopy[scope].helper}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex items-center gap-2 rounded-lg bg-[#ed9c5a] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60 cursor-pointer"
            >
              {creating && (
                <Loader2 className="size-4 animate-spin text-black" />
              )}
              Create key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
