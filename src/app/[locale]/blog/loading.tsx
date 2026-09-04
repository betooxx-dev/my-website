export default function BlogLoading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto min-h-screen max-w-6xl px-6 pb-24 pt-32"
    >
      <div aria-hidden="true" className="animate-pulse">
        <div className="h-4 w-28 rounded-full bg-muted" />
        <div className="mt-5 h-12 max-w-xl rounded-2xl bg-muted" />
        <div className="mt-4 h-5 max-w-2xl rounded-full bg-muted" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              className="h-96 rounded-[1.5rem] border border-border bg-card/45"
              key={item}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
