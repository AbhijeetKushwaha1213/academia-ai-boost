
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Timer, Code, FileText, Plus, Trash2, ExternalLink, Play, Square, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

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
    let interval;
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

  const clearTerminal = () => {
    setTerminalOutput([]);
  };

  // Quick navigation functions
  const openVSCode = () => {
    // This would open VS Code with the project
    window.open("vscode://file/your-project-path", "_blank");
  };

  const openLeetCode = () => {
    // This opens a specific LeetCode problem
    window.open("https://leetcode.com/problems/two-sum/", "_blank");
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
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{projectName}</h2>
              <p className="text-muted-foreground">{projectType} · Due in {deadline}</p>
              <div className="flex items-center gap-4 mt-4">
                <Timer className="text-purple-600" />
                <span className="text-xl font-bold">{Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}</span>
                <Button onClick={handleStart} disabled={isRunning} className="ml-4">Start</Button>
                <Button onClick={handlePause} disabled={!isRunning} variant="secondary">Pause</Button>
                <Button onClick={handleReset} variant="ghost">Reset</Button>
              </div>
              
              {/* Quick Navigation */}
              <div className="flex gap-2 mt-4">
                <Button onClick={openVSCode} variant="outline" size="sm" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Open VS Code
                  <ExternalLink className="w-3 h-3" />
                </Button>
                <Button onClick={openLeetCode} variant="outline" size="sm" className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100">
                  <div className="w-4 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">LC</div>
                  Practice Problem
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="vs-code">
            <TabsList>
              <TabsTrigger value="vs-code">VS Code</TabsTrigger>
              <TabsTrigger value="leetcode">LeetCode</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="terminal">Terminal</TabsTrigger>
            </TabsList>

            <TabsContent value="vs-code">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Code Editor</h3>
                    <Button onClick={openVSCode} size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open in VS Code
                    </Button>
                  </div>
                  <Textarea placeholder="Write or paste your code here..." rows={10} className="font-mono" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leetcode">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Practice Problems</h3>
                    <Button onClick={openLeetCode} size="sm" variant="outline">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Open LeetCode
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={openLeetCode}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Two Sum</h4>
                          <p className="text-sm text-muted-foreground">Array, Hash Table - Easy</p>
                        </div>
                        <div className="w-6 h-6 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">LC</div>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Valid Parentheses</h4>
                          <p className="text-sm text-muted-foreground">String, Stack - Easy</p>
                        </div>
                        <div className="w-6 h-6 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">LC</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Input 
                      placeholder="Resource title" 
                      value={newResource.title}
                      onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    />
                    <Input 
                      placeholder="Resource URL" 
                      value={newResource.url}
                      onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                    />
                    <select 
                      value={newResource.type}
                      onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="documentation">Documentation</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="article">Article</option>
                      <option value="video">Video</option>
                      <option value="pdf">PDF</option>
                    </select>
                    <Button onClick={addResource} className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Resource
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {resources.map(resource => (
                      <div key={resource.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <div>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline">
                              {resource.title}
                            </a>
                            <p className="text-xs text-muted-foreground">{resource.type}</p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => removeResource(resource.id)} 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terminal">
              <Card>
                <CardContent className="p-4">
                  <div className="bg-black text-green-400 font-mono p-4 rounded-lg h-64 overflow-y-auto">
                    {terminalOutput.map((line, index) => (
                      <p key={index} className="text-sm">{line}</p>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="Enter command..."
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                      className="font-mono"
                    />
                    <Button onClick={executeCommand} size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button onClick={clearTerminal} variant="outline" size="sm">
                      <Square className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right - Quick Controls & Mini Terminal */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Quick Actions</h3>
              <Button variant="outline" className="w-full mb-2">View Progress</Button>
              <Button variant="outline" className="w-full mb-2">Submit Update</Button>
              <Button variant="destructive" className="w-full">Mark Complete</Button>
            </CardContent>
          </Card>

          {/* Mini Terminal */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Quick Terminal</h3>
              <div className="bg-black text-green-400 font-mono p-2 rounded text-xs h-32 overflow-y-auto">
                {terminalOutput.slice(-5).map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              <div className="flex gap-1 mt-2">
                <Input 
                  placeholder="cmd..."
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                  className="font-mono text-xs"
                  size="sm"
                />
                <Button onClick={executeCommand} size="sm" className="px-2">
                  <Play className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-sm">
              <h4 className="font-semibold mb-1">Tips & Suggestions</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Break large tasks into smaller steps.</li>
                <li>Keep pushing code regularly.</li>
                <li>Stay consistent — 1 hour daily.</li>
                <li>Use quick navigation to stay focused.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
