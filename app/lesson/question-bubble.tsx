import Image from "next/image";

type Props = {
  question: string;
};

export const QuestionBubble = ({ question }: Props) => {
  return (
    <div className="flex items-center gap-4">
      <Image
        src="/mascot.png"
        alt="Mascot"
        height={70}
        width={70}
        className="rounded-full border border-border shadow-sm"
      />
      <div className="relative px-5 py-3 bg-card border border-border rounded-xl shadow-sm">
        <p className="text-foreground text-base font-medium">{question}</p>
        <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-[6px] border-r-border" />
      </div>
    </div>
  );
};
