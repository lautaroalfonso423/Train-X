import DashboardUserView from "@/views/DashboardUserView";
import ProtectedRoutes from "@/components/ProtectedRout";

export default function DashboardUser() {
    return(
        <ProtectedRoutes>
            <DashboardUserView />
        </ProtectedRoutes>
    )
}