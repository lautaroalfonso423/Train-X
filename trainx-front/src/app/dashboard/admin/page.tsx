
import DashboardAdminView from "@/views/DashboardAdminView"
import ProtectedRoutes from "@/components/ProtectedRout"

export default function DashboardAdmin() {
    return (
        <ProtectedRoutes adminOnly>
        <DashboardAdminView/>
        </ProtectedRoutes>
    )
}