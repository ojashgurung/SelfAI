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
    title: "Team Performance Reviews",
    icon: "/icons/performance.png",
    user: "Wonpil",
    time: "2 weeks ago",
  },
  {
    id: 2,
    title: "Partnership Performance Reviews",
    icon: "/icons/partnership.png",
    user: "Young K",
    time: "3 days ago",
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">My Projects</h1>
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
            <Link href={`/dashboard/chat/${item.id}`} key={item.id}>
              <Card className="p-4 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-100 mb-3" />
                <h3 className="font-medium mb-2">{item.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-6 h-6 rounded-full bg-gray-200" />
                  <span>{item.user}</span>
                  <span>•</span>
                  <span>{item.time}</span>
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
