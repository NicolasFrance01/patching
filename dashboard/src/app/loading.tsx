import { Shield } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full min-h-[80vh] flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Animated outer ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-indigo-500/20 border-t-indigo-500 animate-spin w-16 h-16" />
        
        {/* Logo in the center */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-transparent">
          <Shield className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-400 animate-pulse">
        Cargando...
      </p>
    </div>
  );
}
