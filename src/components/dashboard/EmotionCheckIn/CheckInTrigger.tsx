interface CheckInTriggerProps {
  onOpen: (open: boolean) => void;
}

export function CheckInTrigger({ onOpen }: CheckInTriggerProps) {
  return (
    <div className="-mt-1 cursor-pointer flex items-center" onClick={() => onOpen(true)}>
      <div className="relative flex items-center justify-center w-10 h-10 my-4 ml-4">
        <div className="absolute inset-0 rounded-full bg-primary/40 animate-[ripple_6s_infinite]" />
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-[ripple_6s_infinite_2s]" />
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-[ripple_6s_infinite_4s]" />
        <div className="relative w-6 h-6 rounded-full bg-primary" />
      </div>
      <p className="ml-4 text-lg text-foreground font-semibold">
        Touch Today!
      </p>
    </div>
  );
}
