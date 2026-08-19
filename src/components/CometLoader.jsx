export default function CometLoader() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
      <div className="comet-track" aria-hidden="true">
        <div className="comet-shooting">
          <div className="comet-streak" />
          <div className="comet-head" />
        </div>
      </div>
      <p className="relative z-10 mt-16 text-sm text-subtle">Searching LinkedIn profiles…</p>
    </div>
  );
}
