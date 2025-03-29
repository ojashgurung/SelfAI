import { Settings, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/types/user";

interface UserDropdownProps {
  user: UserInfo | null;
  onLogout: () => void;
}

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
  return (
    <div className="border-t p-4 mt-4">
      <DropdownMenu>
        <div className="w-full">
          <div className="flex items-center gap-3 p-2 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center">
              <span className="text-indigo-700 font-medium">
                {user?.fullname
                  ? user.fullname
                      .split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()
                  : "..."}
              </span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-left">
                {user?.fullname || "Loading..."}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <DropdownMenuTrigger>
              <Settings className="w-5 h-5 mr-2 text-gray-500 hover:text-black transition-colors" />
            </DropdownMenuTrigger>
          </div>
        </div>

        <DropdownMenuContent
          className="w-56 bg-white shadow-lg border border-gray-200"
          align="end"
          side="right"
          sideOffset={12}
          alignOffset={40}
        >
          <DropdownMenuItem className="hover:bg-gray-50">
            <User className="w-4 h-4 mr-2" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-gray-50">
            <Settings className="w-4 h-4 mr-2" />
            <span>Settings</span>
          </DropdownMenuItem>
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
