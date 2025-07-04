
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-2">Quick Actions</h3>
        <Button variant="outline" className="w-full mb-2">View Progress</Button>
        <Button variant="outline" className="w-full mb-2">Submit Update</Button>
        <Button variant="destructive" className="w-full">Mark Complete</Button>
      </CardContent>
    </Card>
  );
}
