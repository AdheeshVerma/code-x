"use client";

import {
  User,
  Github,
  Linkedin,
  MessageSquare,
  UserPlus,
  Globe,
  PenTool,
  Code2,
  Menu,
  Pencil,
} from "lucide-react";

import "./profile_styles.css";
import toast from "react-hot-toast";
import { ReactNode, useState, useRef, useEffect } from "react";
import ThemeSwitcher from "@/components/General/(Color Manager)/ThemeSwitcher";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import EditProfileModal from "./EditProfileModal";
import KnowMoreProfileModal from "./KnowMoreProfileModal";

type PlatformProps = {
  icon: ReactNode;
  label: string;
};

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  profileUrl: string;
  bannerUrl: string;
  headline: string;
  userInfo: string;
};

const platformArray = [
  { icon: Github, label: "Github" },
  { icon: Code2, label: "Leetcode" },
  { icon: PenTool, label: "Medium" },
  { icon: Linkedin, label: "Linkedin" },
  { icon: Globe, label: "Portfolio" },
];

export default function SideSection() {
  const Colors = useColors();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const [data, setData] = useState<User | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const getData = async () => {
    try {
      const res = await fetch(backendUrl + "/api/v1/users/get-profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res) throw new Error("Unable to get Data");

      const result = await res.json();
      console.log("Data fetch success:", result.data);
      setData(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
    console.log(data);
  }, []);

  const uploadProfilePic = async (file: File) => {
    const toastId = toast.loading("Uploading profile picture...");
    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await fetch(`${backendUrl}/api/v1/users/update-ProfilePic`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const result = await res.json();

      if (!result.data?.profileUrl) {
        throw new Error(result.message || "Upload failed");
      }

      setData((prev) =>
        prev
          ? {
              ...prev,
              profileUrl: `${result.data.profileUrl}?t=${Date.now()}`,
            }
          : prev,
      );
      toast.success("Upload Success!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Unable to Upload", { id: toastId });
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [knowMoreOpen, setKnowMoreOpen] = useState(false);
  return (
    <div
      className={`${Colors.background.secondary} w-full min-h-full p-4 flex flex-col justify-between rounded-xl`}
    >
      {/* hidden file input  */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadProfilePic(file);
        }}
      />

      <div>
        <div className="flex justify-center mb-4">
          <div
            className={`
      relative w-50 h-50 rounded-full overflow-hidden
      ${Colors.background.primary}
      group cursor-pointer
      flex items-center justify-center
    `}
            onClick={() => {
              console.log("Edit profile pic");
              fileInputRef.current?.click();
            }}
          >
            {/* Avatar Icon */}
            <div className="flex justify-center mb-4">
              <div
                className={`
      relative w-50 h-50 rounded-full overflow-hidden
      ${Colors.background.primary}
      group cursor-pointer
      flex items-center justify-center
    `}
                onClick={() => fileInputRef.current?.click()}
              >
                {data?.profileUrl ? (
                  <img
                    src={data.profileUrl}
                    alt="Profile"
                    className="
          block
          w-full h-full
          object-cover
          rounded-full
          leading-none
          transition-all duration-200
          group-hover:blur-sm group-hover:opacity-60
        "
                  />
                ) : (
                  <User
                    className="
          w-32 h-32
          text-white
          transition-all duration-200
          group-hover:blur-sm group-hover:opacity-60
        "
                  />
                )}

                {/* Hover overlay */}
                <div
                  className="
        absolute inset-0
        flex items-center justify-center
        bg-black/40
        opacity-0
        group-hover:opacity-100
        transition-opacity duration-200
      "
                >
                  <Pencil className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            {/* Hover Overlay */}
            <div
              className={`
        absolute inset-0
        flex items-center justify-center
        bg-black/40
        opacity-0
        group-hover:opacity-100
        transition-opacity duration-200
      `}
            >
              <Pencil className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div
          className={`${Colors.background.primary} rounded-xl px-4 py-3 flex items-center justify-between`}
        >
          <div>
            <p
              className={`${Colors.text.primary} font-mono text-2xl leading-none`}
            >
              {data?.name ?? "User"}
            </p>
            <p
              className={`text-md ${Colors.text.secondary} font-mono font-bold`}
            >
              {data?.username ?? "@username"}
            </p>
          </div>

          <div className="relative" ref={menuRef}>
            <Menu
              className={`${Colors.text.primary} w-8 h-8 cursor-pointer`}
              onClick={() => setOpen((prev) => !prev)}
            />

            {open && (
              <div
                className={`absolute right-0 top-8 z-50 w-48 rounded-xl ${Colors.background.secondary} backdrop-blur-sm ${Colors.border.defaultThin} shadow-lg`}
              >
                <MenuItem
                  label="Know More"
                  onClick={() => {
                    setKnowMoreOpen(true);
                    setOpen(false);
                  }}
                />
                <Divider />
                <MenuItem label="Add to Wishlist" />
                <Divider />
                <MenuItem
                  label="Edit Profile"
                  onClick={() => {
                    setEditOpen(true);
                    setOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* headline and userInfo  */}
        {/* <div
          className={`mt-4 font-mono ${Colors.background.primary} rounded-xl px-4 py-3 flex items-center justify-between`}
        >
          {data?.headline ?? "Loading...."}
          <br />
          {data?.userInfo ?? "Loading...."}
        </div> */}

        <div
          className={`mt-6 ${Colors.background.primary} rounded-xl p-4 max-h-82 overflow-y-scroll`}
        >
          <p className={`${Colors.text.primary} text-2xl font-mono mb-2`}>
            Other Platforms
          </p>
          <div className={`${Colors.border.defaultThinBottom} mb-3`} />

          {platformArray.map(({ icon: Icon, label }) => (
            <Platform key={label} icon={<Icon />} label={label} />
          ))}
        </div>
      </div>

      <ThemeSwitcher />

      {/* Bottom Buttons */}
      <div className="flex gap-3">
        <button
          className={`${Colors.background.special} ${Colors.properties.interactiveButton} flex-1 py-3 rounded-xl flex items-center justify-center`}
        >
          <UserPlus className={`${Colors.text.inverted}`} />
        </button>
        <button
          className={`${Colors.background.special} ${Colors.properties.interactiveButton} flex-1 py-3 rounded-xl flex items-center justify-center`}
        >
          <MessageSquare className={`${Colors.text.inverted}`} />
        </button>
      </div>

      {/* Edit profile Modal  */}
      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={(payload) => {
          console.log(payload);
          setEditOpen(false);
        }}
      />

      {/* Know more Modal  */}
      <KnowMoreProfileModal
        isOpen={knowMoreOpen}
        onClose={() => setKnowMoreOpen(false)}
        user={{
          name: data?.name ?? "",
          username: data?.username ?? "",
          role: data?.headline ?? "Developer",
          bio: data?.userInfo ?? "",
          email: data?.email ?? "",
          location: "Los Angeles, California",
          gender: "Male",
          dob: "12 Dec 1994",
          profileUrl: data?.profileUrl,
          bannerUrl: data?.bannerUrl,
          techStack: ["React", "Next.js", "Docker", "Java"],
        }}
      />
    </div>
  );
}

function Platform({ icon, label }: PlatformProps) {
  const Colors = useColors();
  return (
    <div
      className={`flex items-center gap-3 ${Colors.text.primary} text-lg font-mono py-1`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function MenuItem({ label, onClick }: { label: string; onClick?: () => void }) {
  const Colors = useColors();

  return (
    <div
      onClick={onClick}
      className={`px-4 py-2 ${Colors.text.primary} rounded-xl font-mono text-sm cursor-pointer hover:opacity-80 transition`}
    >
      {label}
    </div>
  );
}

function Divider() {
  const Colors = useColors();
  return <div className={`mx-3 ${Colors.border.defaultThinBottom}`} />;
}
