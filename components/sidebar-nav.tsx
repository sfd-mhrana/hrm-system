"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavItem {
  label: string
  href: string
  icon: string
}

interface SidebarNavProps {
  items: NavItem[]
  userRole?: string
}

export function SidebarNav({ items, userRole }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className="space-y-2 px-4 py-8">
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant={pathname === item.href ? "default" : "ghost"}
            className={cn("w-full justify-start gap-3 px-4", pathname === item.href && "bg-blue-600 hover:bg-blue-700")}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Button>
        </Link>
      ))}
      {userRole && (
        <div className="mt-8 px-4 py-2">
          <p className="text-xs font-semibold text-slate-500 uppercase">Role: {userRole}</p>
        </div>
      )}
    </nav>
  )
}
