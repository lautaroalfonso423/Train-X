import UserProfileView from "@/views/UserProfileView";
import ProtectedRoutes from "@/components/ProtectedRout";

export default function UserProfile() {
    return(
            <ProtectedRoutes>
            <UserProfileView />
            </ProtectedRoutes>      
    )
}