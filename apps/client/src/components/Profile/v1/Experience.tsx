"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import toast from "react-hot-toast";

type UserExperience = {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  startDate: string;
  endDate?: string | null;
  isOngoing: "ONGOING" | "COMPLETED";
  jobType: "REMOTE" | "OFFLINE" | "HYBRID";
};

type User = {
  id: string;
  userExperiences?: UserExperience[];
};

export default function Experience() {
  const Colors = useColors();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [data, setData] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    startDate: "",
    endDate: "",
    isOngoing: "ONGOING" as "ONGOING" | "COMPLETED",
    jobType: "OFFLINE" as "REMOTE" | "OFFLINE" | "HYBRID",
  });

  const getData = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/v1/users/get-profile`, {
        credentials: "include",
      });
      const result = await res.json();
      setData(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendUrl}/api/v1/users/add-experience`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          startDate: new Date(form.startDate),
          endDate:
            form.isOngoing === "ONGOING"
              ? null
              : form.endDate
                ? new Date(form.endDate)
                : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to create experience");

      await getData();
      setIsOpen(false);
      setForm({
        companyName: "",
        jobTitle: "",
        jobDescription: "",
        startDate: "",
        endDate: "",
        isOngoing: "ONGOING",
        jobType: "OFFLINE",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const toastId = toast.loading("Deleting experience...");
    setDeleting(true);

    try {
      const res = await fetch(
        `${backendUrl}/api/v1/users/delete-experience/${deleteId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Experience deleted", { id: toastId });
      setDeleteId(null);
      await getData(); // refresh list
    } catch (error) {
      console.error(error);
      toast.error("Delete failed", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  const formatMonthYear = (dateValue?: string | null) => {
    if (!dateValue) return "Present";
    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) return "Present";
    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const handleEditPlaceholder = (experienceId: string) => {
    console.log("Edit placeholder for experience:", experienceId);
  };

  const handleDeletePlaceholder = (experienceId: string) => {
    console.log("Delete placeholder for experience:", experienceId);
  };

  const getDescriptionPreview = (description: string) => {
    const firstLine = description
      .split("\n")
      .find((line) => line.trim().length > 0);
    return firstLine?.trim() || "No description added.";
  };

  return (
    <div className={`${Colors.background.primary} rounded-xl p-4`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${Colors.text.primary} font-mono text-xl`}>
          Experience
        </h2>

        <button
          onClick={() => setIsOpen(true)}
          className={`${Colors.background.special} ${Colors.text.inverted} ${Colors.properties.interactiveButton} flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm`}
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>

      {/* Experience List */}
      {data?.userExperiences && data.userExperiences.length > 0 ? (
        <div className="space-y-3 max-h-112 overflow-y-auto pr-1">
          {data.userExperiences.map((exp) => (
            <div
              key={exp.id}
              className={`${Colors.background.secondary} rounded-lg p-4 ${Colors.border.defaultThin}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className={`${Colors.text.primary} font-mono text-base font-semibold`}
                  >
                    {exp.jobTitle}
                  </p>
                  <p
                    className={`${Colors.text.secondary} text-sm font-mono mt-1`}
                  >
                    {exp.companyName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditPlaceholder(exp.id)}
                    className={`${Colors.properties.interactiveButton} ${Colors.text.primary} text-xs font-mono px-3 py-1.5 rounded-md ${Colors.border.defaultThin}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(exp.id)}
                    className={`${Colors.properties.interactiveButton} text-red-500 text-xs font-mono px-3 py-1.5 rounded-md ${Colors.border.defaultThin}`}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`${Colors.background.primary} ${Colors.text.secondary} text-xs font-mono px-2 py-1 rounded-md ${Colors.border.defaultThin}`}
                >
                  {exp.jobType}
                </span>
                <span
                  className={`${Colors.background.primary} ${Colors.text.secondary} text-xs font-mono px-2 py-1 rounded-md ${Colors.border.defaultThin}`}
                >
                  {exp.isOngoing === "ONGOING" ? "Ongoing" : "Completed"}
                </span>
              </div>

              <p className={`${Colors.text.secondary} text-sm font-mono mt-3`}>
                {formatMonthYear(exp.startDate)} -{" "}
                {exp.isOngoing === "ONGOING"
                  ? "Present"
                  : formatMonthYear(exp.endDate)}
              </p>

              <p
                className={`${Colors.text.secondary} text-sm font-mono mt-3 truncate`}
                title={exp.jobDescription}
              >
                {getDescriptionPreview(exp.jobDescription)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className={`${Colors.text.secondary} text-sm font-mono`}>
          No experience added yet.
        </p>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className={`${Colors.background.primary} w-full max-w-lg rounded-xl p-6`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${Colors.text.primary} font-mono text-lg`}>
                Add Experience
              </h3>
              <X
                className="cursor-pointer opacity-70 hover:opacity-100"
                onClick={() => setIsOpen(false)}
              />
            </div>

            {/* Form */}
            <div className="space-y-3">
              <Input
                label="Company Name"
                value={form.companyName}
                onChange={(v) => setForm({ ...form, companyName: v })}
              />

              <Input
                label="Job Title"
                value={form.jobTitle}
                onChange={(v) => setForm({ ...form, jobTitle: v })}
              />

              <Textarea
                label="Job Description"
                value={form.jobDescription}
                onChange={(v) => setForm({ ...form, jobDescription: v })}
              />

              <Input
                label="Start Date"
                type="date"
                value={form.startDate}
                onChange={(v) => setForm({ ...form, startDate: v })}
              />

              {form.isOngoing === "COMPLETED" && (
                <Input
                  label="End Date"
                  type="date"
                  value={form.endDate}
                  onChange={(v) => setForm({ ...form, endDate: v })}
                />
              )}

              <Select
                label="Job Type"
                value={form.jobType}
                onChange={(v) => setForm({ ...form, jobType: v })}
              />

              <label
                className={`${Colors.text.primary} flex items-center gap-2 text-sm font-mono`}
              >
                <input
                  type="checkbox"
                  checked={form.isOngoing === "ONGOING"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isOngoing: e.target.checked ? "ONGOING" : "COMPLETED",
                      endDate: "",
                    })
                  }
                />
                Currently Working Here
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className={`flex-1 py-2 rounded-lg border font-mono ${Colors.properties.interactiveButton}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`${Colors.background.special} ${Colors.text.inverted} ${Colors.properties.interactiveButton} flex-1 py-2 rounded-lg font-mono`}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* delete modal  */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div
            className={`${Colors.background.primary} w-full max-w-sm rounded-xl p-6`}
          >
            <h3 className={`${Colors.text.primary} font-mono text-lg`}>
              Delete Experience?
            </h3>

            <p className={`${Colors.text.secondary} text-sm font-mono mt-2`}>
              This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg border font-mono"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white font-mono"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Reusable Inputs ---------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  const Colors = useColors();

  return (
    <div>
      <label className={`${Colors.text.primary} text-sm font-mono mb-1 block`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg ${Colors.background.secondary} ${Colors.text.primary} font-mono outline-none`}
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const Colors = useColors();

  return (
    <div>
      <label className={`${Colors.text.primary} text-sm font-mono mb-1 block`}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg h-24 ${Colors.background.secondary} ${Colors.text.primary} font-mono outline-none`}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
}: {
  label: string;
  value: "REMOTE" | "OFFLINE" | "HYBRID";
  onChange: (v: "REMOTE" | "OFFLINE" | "HYBRID") => void;
}) {
  const Colors = useColors();

  return (
    <div>
      <label className={`${Colors.text.primary} text-sm font-mono mb-1 block`}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value as "REMOTE" | "OFFLINE" | "HYBRID")
        }
        className={`w-full px-3 py-2 rounded-lg ${Colors.background.secondary} ${Colors.text.primary} font-mono outline-none`}
      >
        <option value="OFFLINE">Offline</option>
        <option value="REMOTE">Remote</option>
        <option value="HYBRID">Hybrid</option>
      </select>
    </div>
  );
}
