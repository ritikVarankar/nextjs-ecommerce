
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { showToast } from "@/lib/showToast";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import { logout } from "@/store/reducer/authReducer";
import axios from "axios";
import { useRouter } from "next/navigation";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useDispatch } from "react-redux";

function LogoutButton() {
  const router = useRouter();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/auth/logout', {}); // Await the response
      const logoutResponse = response.data; // Now we can safely destructure 'data'
      console.log(logoutResponse);
      
      if (!logoutResponse.success) {
        throw new Error(logoutResponse.message);
      }

      showToast('success', logoutResponse.message);
      dispatch(logout());
      router.push(WEBSITE_LOGIN);
    } catch (error: any) {
      console.log(error);
      showToast('error', error.message);
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
        <RiLogoutCircleRLine color="red" />
        Logout
    </DropdownMenuItem>
  );
}

export default LogoutButton;
