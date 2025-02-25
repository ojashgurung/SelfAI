import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BellIcon, ShareIcon, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const favorites = [
  {
    id: 1,
    title: "View Analytics",
    icon: "/icons/performance.png",
  },
  {
    id: 2,
    title: "Partnership Performance Reviews",
    icon: "/icons/partnership.png",
  },
  {
    id: 3,
    title: "Mobile App Redesign",
    icon: "/icons/mobile.png",
    user: "Dowoon",
    time: "2 months ago",
  },
  {
    id: 4,
    title: "Competitor Analysis Sessions",
    icon: "/icons/analysis.png",
    user: "Park Sungjin",
    time: "1 month ago",
  },
];

const recentFiles = [
  {
    title: "Partner_A_Strategic_Meetings_Overview.mp4",
    duration: "00:25:00",
    size: "22MB",
    creator: "Young K",
    category: "Partnerships & Collaborations",
    lastViewed: "2 mins ago",
  },
  // Add more files as needed
];

export default function DashboardPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <ShareIcon className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" className="w-10 h-10 p-0">
            <BellIcon className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="w-10 h-10 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Favorites</h2>
          <Button variant="ghost" size="sm">
            See all
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {favorites.map((item) => (
            <Link
              href={`/dashboard/chat/${item.id}`}
              key={item.id}
              className="h-full"
            >
              <Card className="p-6 bg-white rounded-3xl hover:bg-gray-50/80 transition-colors h-full flex flex-col">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 mb-4 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 via-rose-300 to-rose-200 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white/30 rounded-md" />
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-3 text-base flex-1">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-auto">
                  <div className="flex items-center text-sm text-gray-500 gap-1">
                    <span>{item.user}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" className="text-blue-600">
            Recent
          </Button>
          <Button variant="ghost">Owned by me</Button>
          <Button variant="ghost">Shared with me</Button>
          <Button variant="ghost">Archived</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Created by</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Last Viewed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentFiles.map((file) => (
              <TableRow key={file.title}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-100" />
                    <div>
                      <p>{file.title}</p>
                      <p className="text-sm text-gray-500">
                        {file.duration} • {file.size}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200" />
                    {file.creator}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                    {file.category}
                  </span>
                </TableCell>
                <TableCell className="text-right">{file.lastViewed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
