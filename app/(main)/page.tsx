import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex">
      <p>This is a protected route.</p>
      <UserButton afterSignOutUrl="/"/>
    </div>
    
  )
}
