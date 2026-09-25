import Image from "next/image";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Animated outer ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-indigo-500/20 border-t-indigo-500 animate-spin w-16 h-16" />
        
        {/* Logo in the center */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-transparent">
          <Image src="/logo (2).png" alt="Cargando" width={32} height={32} className="animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-400 animate-pulse">
        Cargando dashboard...
      </p>
    </div>
  );
}
