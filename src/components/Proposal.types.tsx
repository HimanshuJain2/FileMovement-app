export type TStatus =
    | `OSD to Hon'ble DCM`
    | `Secretary to Hon'ble DCM`
    | `Private Secretary to Hon'ble DCM`
    | `Addl Private Secretary to Hon'ble DCM`
    | `Home Office to Hon'ble DCM`
    | 'Dispatched/Disposed'

export type statusType = {
    actor: string
    status: TStatus
    dateTime: string
    forwardTo: string
    comment: string
}

export type Proposal = {
    id: string
    fileId: string
    department?: string
    subject?: string
    fileNo?: string
    details?: string
    forwardTo?: string
    status: TStatus
    dispatchStatus?: 'Pending Dispatch' | 'Dispatched/Disposed'
    remarks?: string
    statusHistory: statusType[]
}
