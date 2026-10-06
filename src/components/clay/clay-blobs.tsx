export function ClayBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="animate-clay-float absolute -top-[10%] -left-[10%] h-[60vh] w-[60vh] rounded-full bg-[#009B9A]/12 blur-3xl" />
      <div className="animate-clay-float-delayed animation-delay-2000 absolute -right-[10%] top-[20%] h-[55vh] w-[55vh] rounded-full bg-[#48D7D2]/12 blur-3xl" />
      <div className="animate-clay-float-slow animation-delay-4000 absolute bottom-[-15%] left-[20%] h-[50vh] w-[50vh] rounded-full bg-[#007A7A]/10 blur-3xl" />
      <div className="animate-clay-float absolute top-[55%] right-[25%] h-[35vh] w-[35vh] rounded-full bg-[#009B9A]/08 blur-3xl" />
    </div>
  );
}
