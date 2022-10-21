import { BookingStatus } from "../types";

export const COLORS = {
    RED: '#602323',
    YELLOW: '#6f4724',
    GREEN: '#2b6023'
}

export const RED_STATUSES = [
    BookingStatus.DRIVER_NOT_ASSIGNED,
    BookingStatus.DRIVER_LATE,
    BookingStatus.DRIVER_WRONG_PICKUP_LOCATION,
    BookingStatus.DRIVER_WRONG_DROP_OFF_LOCATION
]

const getStatusColor = (status: string): string => {
    const { RED, YELLOW, GREEN } = COLORS;

    switch (status) {
        case BookingStatus.DRIVER_NOT_ASSIGNED:
            return RED;
        case BookingStatus.DRIVER_LATE:
            return RED;
        case BookingStatus.DRIVER_ON_THE_WAY:
            return YELLOW
        case BookingStatus.DRIVER_WRONG_PICKUP_LOCATION:
            return RED
        case BookingStatus.DRIVER_WRONG_DROP_OFF_LOCATION:
            return RED
        case BookingStatus.RIDE_COMPLETED:
            return GREEN
        case BookingStatus.REALLOCATED:
            return GREEN
        case BookingStatus.REFUNDED:
            return YELLOW
        default:
            return GREEN
    }
}

export default getStatusColor