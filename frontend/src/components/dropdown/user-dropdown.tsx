import { Settings, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/types/user";
import Link from "next/link";

interface UserDropdownProps {
  user: UserInfo | null;
  style: string;
  withIcon: boolean;
  reversed?: boolean;
  align: "start" | "center" | "end";
  side: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  alignOffset?: number;
  onLogout: () => void;
}

export function UserDropdown({
  user,
  onLogout,
  style,
  withIcon,
  align,
  side,
  sideOffset,
  alignOffset,
  reversed = false,
}: UserDropdownProps) {
  return (
    <div className={`${style}`}>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full rounded-xl hover:bg-indigo-50  hover:underline  transition">
          {reversed ? (
            <div className="flex items-center gap-3 rounded-lg">
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-right">
                  {user?.fullname || "Loading..."}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center">
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.fullname}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {user?.fullname
                      ? user.fullname
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .toUpperCase()
                      : "..."}
                  </span>
                )}
              </div>
              {withIcon && (
                <Settings className="w-5 h-5 mr-2 text-gray-500 hover:text-black transition-colors" />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center">
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt={user.fullname}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {user?.fullname
                      ? user.fullname
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .toUpperCase()
                      : "..."}
                  </span>
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-left">
                  {user?.fullname || "Loading..."}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              {withIcon && (
                <Settings className="w-5 h-5 mr-2 text-gray-500 hover:text-black transition-colors" />
              )}
            </div>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 bg-white shadow-lg border border-gray-200"
          align={align}
          side={side}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
        >
          {/* TODO: Change the href route after completing the pages (profile & setting) */}
          <Link href={"/dashboard"}>
            <DropdownMenuItem className="hover:bg-gray-50" disabled>
              <User className="w-4 h-4 mr-2" />
              <span>Profile (coming soon)</span>
            </DropdownMenuItem>
          </Link>
          <Link href={"/dashboard"}>
            <DropdownMenuItem className="hover:bg-gray-50" disabled>
              <Settings className="w-4 h-4 mr-2" />
              <span>Settings (coming soon)</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator className="bg-gray-200" />
          <DropdownMenuItem
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
