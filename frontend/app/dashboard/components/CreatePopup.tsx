import { FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import useDashboardContext from "../hooks/useDashboard";

export default function CreatePopup() {
  const {
    creating,
    createOpen,
    createInput,
    setCreateOpen,
    setCreateInput,
    handleCreate,
  } = useDashboardContext();

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    handleCreate(ev);
  };

  return (
    createOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
        <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Create new link</h2>
            <button
              onClick={() => setCreateOpen(false)}
              className="text-zinc-400 hover:text-white cursor-pointer transition"
            >
              <X />
            </button>
          </div>
          <form className="space-y-4" onSubmit={onSubmit}>
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-zinc-300">URL de destino</span>
              <input
                type="url"
                required
                value={createInput}
                onChange={(ev) => setCreateInput(ev.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-[#ed9c5a]"
                placeholder="https://exemplo.com"
              />
            </label>
            <div className="flex justify-end gap-2">
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
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
