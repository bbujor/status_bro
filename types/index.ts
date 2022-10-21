export enum BookingStatus {
    DRIVER_NOT_ASSIGNED = "DRIVER_NOT_ASSIGNED",
    DRIVER_LATE = "DRIVER_LATE",
    DRIVER_ON_THE_WAY = "DRIVER_ON_THE_WAY",
    DRIVER_WRONG_PICKUP_LOCATION = "DRIVER_WRONG_PICKUP_LOCATION",
    DRIVER_WRONG_DROP_OFF_LOCATION = "DRIVER_WRONG_DROP_OFF_LOCATION",
    RIDE_COMPLETED = "RIDE_COMPLETED",
    REFUNDED = "REFUNDED",
    REALLOCATED = "REALLOCATED",
}

export interface APIResponse {
    booking: BookingData[];
    data: {
        last30Mins: BookingStats;
        next30Mins: BookingStats;
    }
    ridesAmendmentsData: AmendmentStats;
}

export interface BookingData {
    bookingId: string;
    pickupLocation: string;
    dropOffLocation: string;
    pickUpTime: string;
    status: string;
}

export interface BookingStats {
    numberOfDriverNotHere: number;
    driverNotAssigned: number;
    driverLate: number;
    wrongPickupLocation: number;
    wrongDropOffLocation: number;
    ridesCompleted: number;
}

export interface AmendmentStats {
    numberOfRefunds: number;
    numberOfReallocations: number;
}