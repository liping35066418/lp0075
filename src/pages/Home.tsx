import { CameraPreview } from "@/components/CameraPreview";
import { MeasurementCanvas } from "@/components/MeasurementCanvas";
import { TopStatusBar } from "@/components/TopStatusBar";
import { ControlPanel } from "@/components/ControlPanel";
import { ActionButtons } from "@/components/ActionButtons";

const Home = () => {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-space-950">
      <CameraPreview />
      <MeasurementCanvas />
      <TopStatusBar />
      <ActionButtons />
      <ControlPanel />
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-neon-cyan/5 blur-[140px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-neon-orange/5 blur-[140px]" />
      </div>
    </main>
  );
};

export default Home;
