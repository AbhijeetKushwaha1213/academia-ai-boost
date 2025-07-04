
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import ProjectHeader from "./ProjectHeader";
import ProjectTabs from "./ProjectTabs";
import QuickActions from "./QuickActions";
import MiniTerminal from "./MiniTerminal";
import TipsCard from "./TipsCard";

interface ProjectFocusViewProps {
  projectName?: string;
  projectType?: string;
  deadline?: string;
  onBack: () => void;
}

export default function ProjectFocusView({ 
  projectName = "React Portfolio Website", 
  projectType = "Frontend Project", 
  deadline = "2 days",
  onBack 
}: ProjectFocusViewProps) {
  const [timer, setTimer] = useState(3600); // 1 hour default
  const [isRunning, setIsRunning] = useState(false);
  const [resources, setResources] = useState([
    { id: 1, title: "React Docs", url: "https://react.dev", type: "documentation" },
    { id: 2, title: "Tailwind CSS Guide", url: "https://tailwindcss.com/docs", type: "documentation" }
  ]);
  const [newResource, setNewResource] = useState({ title: "", url: "", type: "documentation" });
  const [terminalOutput, setTerminalOutput] = useState([
    "$ npm start",
    "Launching dev server...",
    "✔️ Project running at localhost:3000"
  ]);
  const [terminalInput, setTerminalInput] = useState("");

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setTimer(3600);
    setIsRunning(false);
  };

  // Resource management
  const addResource = () => {
    if (newResource.title && newResource.url) {
      setResources([...resources, { ...newResource, id: Date.now() }]);
      setNewResource({ title: "", url: "", type: "documentation" });
    }
  };

  const removeResource = (id: number) => {
    setResources(resources.filter(r => r.id !== id));
  };

  // Terminal functionality
  const executeCommand = () => {
    if (terminalInput.trim()) {
      const newOutput = [...terminalOutput, `$ ${terminalInput}`];
      
      // Simulate command responses
      if (terminalInput.includes("npm install")) {
        newOutput.push("Installing dependencies...", "✔️ Installation complete");
      } else if (terminalInput.includes("git")) {
        newOutput.push("✔️ Git command executed");
      } else if (terminalInput.includes("npm run")) {
        newOutput.push("Running script...", "✔️ Script executed successfully");
      } else {
        newOutput.push("Command executed");
      }
      
      setTerminalOutput(newOutput);
      setTerminalInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{projectName}</h1>
            <p className="text-sm text-gray-600">{projectType} · Due in {deadline}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 p-6">
        {/* Left - Main Focus Area */}
        <div className="col-span-3 space-y-4">
          <ProjectHeader
            projectName={projectName}
            projectType={projectType}
            deadline={deadline}
            timer={timer}
            isRunning={isRunning}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
          />

          <ProjectTabs
            resources={resources}
            newResource={newResource}
            terminalOutput={terminalOutput}
            terminalInput={terminalInput}
            onResourceAdd={addResource}
            onResourceRemove={removeResource}
            onNewResourceChange={setNewResource}
            onTerminalInputChange={setTerminalInput}
            onTerminalExecute={executeCommand}
            onTerminalClear={() => setTerminalOutput([])}
          />
        </div>

        {/* Right - Quick Controls & Mini Terminal */}
        <div className="space-y-4">
          <QuickActions />
          <MiniTerminal
            terminalOutput={terminalOutput}
            terminalInput={terminalInput}
            onTerminalInputChange={setTerminalInput}
            onTerminalExecute={executeCommand}
          />
          <TipsCard />
        </div>
      </div>
    </div>
  );
}
