import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="w-full bg-[var(--background)] border-t border-[var(--border)] py-6 mt-12">
      <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-6 text-sm text-[var(--muted-foreground)]">
        <div className="flex items-center gap-4">
          <Image
            src="/flag.svg"
            alt="Albanian Flag"
            height={32}
            width={32}
            className="rounded-sm"
          />
          <span>Learn Albanian. One word at a time.</span>
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-[var(--primary)] transition">
            Privacy
          </a>
          <a href="#" className="hover:text-[var(--primary)] transition">
            Terms
          </a>
          <span className="text-xs text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} Learn
          </span>
        </div>
      </div>
    </footer>
  );
};
