"use client";

import {
    MapPin,
    Mail,
    Phone,
    User as UserIcon,
    Pencil,
    Plus,
} from "lucide-react";
import { useColors } from "@/components/General/(Color Manager)/useColors";
import { JSX } from "react";
import { useRouter } from "next/navigation";

type JobListing = {
    id: string;
    title: string;
    location?: string;
    type?: string;
};

type OrganisationProfile = {
    name: string;
    username: string;
    tagline?: string;
    about?: string;
    email?: string;
    location?: string;
    phone?: string;
    logoUrl?: string;
    bannerUrl?: string;
    jobs?: JobListing[];
};

type Props = {
    organisation: OrganisationProfile;
};

export default function OrganisationDashboard({ organisation }: Props) {
    const Colors = useColors();
    const router = useRouter();

    return (
        <div className={`min-h-screen ${Colors.background.primary} px-8 py-10`}>

            {/* HEADER BANNER */}
            <div className="relative h-56 rounded-3xl overflow-hidden shadow-xl">
                {organisation.bannerUrl ? (
                    <img
                        src={organisation.bannerUrl}
                        className="w-full h-full object-cover"
                        alt="organisation banner"
                    />
                ) : (
                    <div className={`w-full h-full ${Colors.background.secondary}`} />
                )}
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto -mt-20 relative z-10">

                {/* ORG TOP SECTION */}
                <div
                    className={`
            rounded-3xl p-8
            ${Colors.background.secondary}
            ${Colors.border.defaultThin}
            shadow-2xl
          `}
                >
                    <div className="flex items-start justify-between gap-6 flex-wrap">

                        {/* LOGO + INFO */}
                        <div className="flex items-center gap-6">
                            <div
                                className={`
                  w-32 h-32 rounded-2xl overflow-hidden
                  ${Colors.background.primary}
                  ${Colors.border.defaultThin}
                `}
                            >
                                {organisation.logoUrl ? (
                                    <img
                                        src={organisation.logoUrl}
                                        className="w-full h-full object-cover"
                                        alt="logo"
                                    />
                                ) : (
                                    <UserIcon className={`w-full h-full p-6 ${Colors.text.inverted}`} />
                                )}
                            </div>

                            <div>
                                <h1 className={`text-4xl font-bold ${Colors.text.primary}`}>
                                    {organisation.name}
                                </h1>

                                <p className={`${Colors.text.secondary} mt-1`}>
                                    @{organisation.username}
                                </p>

                                {organisation.tagline && (
                                    <p className={`mt-3 font-semibold ${Colors.text.special}`}>
                                        {organisation.tagline}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* CREATE INTERVIEWER BUTTON */}
                        <button
                            onClick={() => router.push("/dashboard/create-interviewer")}
                            className={`
                flex items-center gap-2 px-6 py-3 rounded-xl
                ${Colors.background.primary}
                ${Colors.border.defaultThin}
                ${Colors.text.primary}
                ${Colors.properties.interactiveButton}
                transition
              `}
                        >
                            <Plus size={18} />
                            Create Interviewer
                        </button>
                    </div>
                </div>

                {/* GRID SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

                    {/* LEFT INFO CARD */}
                    <div
                        className={`
              rounded-2xl p-6 space-y-5
              ${Colors.background.secondary}
              ${Colors.border.defaultThin}
            `}
                    >
                        <Info icon={<MapPin />} text={organisation.location} />
                        <Info icon={<Mail />} text={organisation.email} />
                        <Info icon={<Phone />} text={organisation.phone} />
                    </div>

                    {/* RIGHT CONTENT */}
                    <div
                        className={`
              lg:col-span-2 rounded-2xl p-6
              ${Colors.background.secondary}
              ${Colors.border.defaultThin}
            `}
                    >
                        {/* ABOUT */}
                        {organisation.about && (
                            <>
                                <h2 className={`text-xl font-semibold mb-4 ${Colors.text.primary}`}>
                                    About Organisation
                                </h2>
                                <p className={`text-sm leading-relaxed ${Colors.text.primary}`}>
                                    {organisation.about}
                                </p>
                            </>
                        )}

                        <div className={`my-8 h-px ${Colors.border.defaultThin}`} />

                        {/* JOB LISTINGS */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`text-xl font-semibold ${Colors.text.primary}`}>
                                Job Listings
                            </h2>
                        </div>

                        {organisation.jobs && organisation.jobs.length > 0 ? (
                            <div className="space-y-4">
                                {organisation.jobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className={`
                      p-5 rounded-xl
                      ${Colors.background.primary}
                      ${Colors.border.defaultThin}
                      transition
                      hover:scale-[1.01]
                    `}
                                    >
                                        <h3 className={`font-semibold ${Colors.text.primary}`}>
                                            {job.title}
                                        </h3>
                                        <p className={`text-sm mt-1 ${Colors.text.secondary}`}>
                                            {job.location} • {job.type}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={`${Colors.text.secondary} text-sm`}>
                                No job listings yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* -------- INFO ROW -------- */

function Info({ icon, text }: { icon: JSX.Element; text?: string }) {
    const Colors = useColors();
    if (!text) return null;

    return (
        <div className="flex items-center gap-4 text-sm">
            <span className={Colors.text.special}>{icon}</span>
            <span className={Colors.text.primary}>{text}</span>
        </div>
    );
}