export default function StudioLoading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto min-h-screen max-w-7xl px-6 py-16"
    >
      <div aria-hidden="true" className="animate-pulse">
        <div className="h-5 w-32 rounded-full bg-muted" />
        <div className="mt-5 h-12 max-w-lg rounded-2xl bg-muted" />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              className="h-72 rounded-[1.5rem] border border-border bg-card/45"
              key={item}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
