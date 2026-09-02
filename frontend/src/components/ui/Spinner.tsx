export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-16 ${className}`}>
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-taupe border-t-transparent" />
    </div>
  );
}
