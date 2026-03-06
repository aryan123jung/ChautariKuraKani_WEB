"use client";

type InfoSection = {
  heading: string;
  body: string;
};

const helpSections: InfoSection[] = [
  {
    heading: "Account & Login",
    body:
      "Use Settings to change theme and profile details. If Face ID login fails, log in once with email/password and enable Remember account for Face ID.",
  },
  {
    heading: "Posts & Comments",
    body:
      "Use the three-dot menu on posts to edit, delete, or report. In comments, you can add, delete your own comments, and moderators/owners can remove as permitted.",
  },
  {
    heading: "Messages & Calls",
    body:
      "You can chat and call only with friends. If calls do not connect, check that both devices are on stable network and app permissions (microphone/camera) are enabled.",
  },
];

const privacySections: InfoSection[] = [
  {
    heading: "Data We Use",
    body:
      "We use account details, profile photos, posts, comments, messages, and call metadata to operate core app features.",
  },
  {
    heading: "How Data Is Used",
    body:
      "Your data is used to show your profile, connect with friends, deliver notifications, and support moderation/report workflows.",
  },
  {
    heading: "Security",
    body:
      "Authenticated APIs require a valid token. Sensitive actions such as reporting and moderation are permission-controlled on backend.",
  },
  {
    heading: "Your Controls",
    body:
      "You can update profile info, remove posts/comments you own, manage friend connections, and report harmful content or users.",
  },
];

function InfoBlock({ title, sections }: { title: string; sections: InfoSection[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">{title}</h2>
      <div className="mt-4 space-y-3">
        {sections.map((section) => (
          <article
            key={section.heading}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{section.heading}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">{section.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function HelpPage() {
  return (
    <div className="space-y-6 p-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Help</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-zinc-300">
          Quick guidance for account, posting, messaging, calling, and privacy.
        </p>
      </header>

      <InfoBlock title="Help Center" sections={helpSections} />
      <InfoBlock title="Privacy Policy" sections={privacySections} />
    </div>
  );
}

