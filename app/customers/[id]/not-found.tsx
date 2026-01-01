export default function CustomerNotFound() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-center space-y-4">
      <h1 className="text-2xl font-bold">Customer not found</h1>
      <p className="text-muted-foreground">
        The customer you’re looking for does not exist.
      </p>
    </div>
  );
}