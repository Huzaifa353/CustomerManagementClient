export default function LoadingCustomerProfile() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="h-8 w-48 bg-muted rounded animate-pulse" />

      <div className="grid grid-cols-2 gap-4 border rounded-lg p-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-24 bg-muted rounded animate-pulse" />
            <div className="h-4 w-40 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
