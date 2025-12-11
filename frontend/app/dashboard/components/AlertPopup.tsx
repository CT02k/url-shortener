import { X } from "lucide-react";
import useDashboardContext from "../hooks/useDashboard";
import Link from "next/link";

export default function AlertPopup() {
  const { alerts, handleCloseAlert } = useDashboardContext();

  const alert = alerts[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur px-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{alert.title}</h2>
          <button
            onClick={() => handleCloseAlert(alert.id)}
            className="text-zinc-400 hover:text-white cursor-pointer transition"
          >
            <X />
          </button>
        </div>
        <div className="content">
          <p>
            It appears that your API token has been posted to the internet.
            <br />
            <br />
            Fortunately, we detected the issue in time and removed your token —
            hopefully before anyone could misuse it!
            <br />
            Your token was found here:{" "}
            <Link
              href={alert.content}
              className="text-[#ed9c5a] font-medium hover:underline"
            >
              {alert.content}
            </Link>
            <br /> <br /> Please be more cautious moving forward to avoid
            unintentionally uploading your token publicly.
          </p>
        </div>
        <div className="flex justify-end mt-8">
          <button
            onClick={() => handleCloseAlert(alert.id)}
            className="flex items-center gap-2 rounded-lg bg-[#ed9c5a] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60 cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
