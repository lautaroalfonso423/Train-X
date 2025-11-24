import { SubStatus } from "src/pay.enum";



export function mapStatus (status: string): SubStatus {

    switch (status) {
        case 'authorized':
        case 'active':
        case 'approved':    
            return SubStatus.ACTIVE;
        case 'paused':
        case 'pending':
            return SubStatus.PENDING;
        case 'cancelled':
        case 'cancelled_by_user':
            return SubStatus.CANCELLED;
        default:
            return SubStatus.PENDING;
    }


}