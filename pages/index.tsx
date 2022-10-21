import { Badge, Button, Grid, Group, Image, Menu, Stack, Table, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import fetch from "isomorphic-unfetch";
import type { NextPage } from 'next';
import { Head } from 'next/document';
import { ReactElement, useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import { APIResponse, BookingData, BookingStatus } from '../types';
import getStatusColor, { COLORS } from '../utils/getStatusColor';
import showSkeleton from '../utils/showSkeleton';

const getStatCard = (label: string, value: number, sstyle: unknown): ReactElement =>
    <section className={[styles.rideStats, sstyle].join(' ')}>
        <Text size="sm" style={{ overflow: 'hidden', whiteSpace: 'nowrap'}}>
            {label}
        </Text>
        <Title order={1} style={{ fontFamily: 'Book King'}}>
            {value}
        </Title>
    </section>

const getRows = (d: APIResponse, filterStatus: BookingStatus | undefined): ReactElement =>
    <>
        {d.booking.map(({bookingId, pickUpTime, pickUpLocation, dropOffLocation, status}: BookingData) => {
            if (filterStatus !== undefined && status !== filterStatus) {
                return <></>
            }
            return (
            <tr key={bookingId}>
                <td>{bookingId}</td>
                <td>{pickUpLocation}</td>
                <td>{dropOffLocation}</td>
                <td>
                    <Stack>
                        <Group className={styles.iconLabel}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar-event" width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <rect x="4" y="5" width="16" height="16" rx="2" />
                                <line x1="16" y1="3" x2="16" y2="7" />
                                <line x1="8" y1="3" x2="8" y2="7" />
                                <line x1="4" y1="11" x2="20" y2="11" />
                                <rect x="8" y="15" width="2" height="2" />
                            </svg>
                            <Text>
                                {dayjs(pickUpTime).format("DD/MM/YYYY")}
                            </Text>
                        </Group>
                        <Group className={styles.iconLabel}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-clock" width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#fff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <circle cx="12" cy="12" r="9" />
                                <polyline points="12 7 12 12 15 15" />
                            </svg>
                            <Text>
                                {dayjs(pickUpTime).format("HH:mm")}
                            </Text>
                        </Group>
                    </Stack>
                </td>
                <td>
                    <Badge variant="filled" styles={{ root: {
                        backgroundColor: getStatusColor(status)
                    }}}>
                        {status}
                    </Badge>
                </td>
                <td>
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Button radius='sm' size='xs' styles={{ root: {
                                backgroundColor: '#0A3A7A'
                            }}}>Manage</Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Label>Select an option</Menu.Label>
                            <Menu.Item>Call customer</Menu.Item>
                            <Menu.Item>Send email</Menu.Item>
                            <Menu.Item>Send SMS</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </td>
            </tr>
            )
            }
        )}
    </>

const getStatusesList = (bookings: BookingData[]): BookingStatus[] => {
    const list: BookingStatus[] = [];
    bookings.map(b => {
        if (!list.includes(b.status as BookingStatus)) {
            list.push(b.status as BookingStatus)
        }
    })
    return list
}

const Home: NextPage = () => {
    const [loadedData, setLoadedData] = useState<APIResponse | undefined>(undefined)
    const [refreshedAt, setRefreshedAt] = useState<Date>(new Date())
    const [filterStatus, setFilterStatus] = useState<BookingStatus | undefined>(undefined)
    const refInterval = useRef<any>(null)

    const fetchData = async () => {
        try {
            if (!process.env.NEXT_PUBLIC_BASE_URL) {
                alert('please set a URL in the .env file')
                return
            }
            const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL)
            if (!response.ok) {
                alert("error loading data from API")
                return
            }
            const data = await response.json() as APIResponse
            setRefreshedAt(new Date())
            const sortedBookings = data.booking.sort((a, b) => dayjs(a.pickUpTime).isAfter(dayjs(b.pickUpTime)) ? 1 : -1)
            return setLoadedData({
                ...data,
                booking: sortedBookings
            })
        } catch {
            alert("an error occurred")
        }
    }

    useEffect(() => {
        fetchData();
        refInterval.current = setInterval(() => {
            fetchData();
        }, 30 * 1000)

        return () => {
            if (refInterval.current) {
                clearInterval(refInterval.current);
            }
        }
    }, [])

    const handleFilterClick = (e: any) => {
        setFilterStatus(e.target.dataset.status as BookingStatus)
    }

  return (
    <div className={styles.container}>
        <Group>
            <Image src="status_bro_logo.svg" alt="status bro logo" width={200} style={{ padding: '1em'}} />
            <Stack style={{ paddingLeft: '2em', gap: '0'}}>
                <Text weight={600} color="red">Live data</Text>
                <Text>Last refreshed at: {dayjs(refreshedAt).format("HH:mm")}</Text>
            </Stack>
        </Group>
        <div style={{ padding: '1em', display: 'flex' }}>
            <Stack justify="space-between" p="0" style={{ gap: '0'}}>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '1.25em'}}>
                    <span style={{ padding: '0 0.5em'}}>
                        Total
                    </span>
                    {getStatCard('Refunds', !loadedData ? 0 : loadedData.ridesAmendmentsData.numberOfRefunds, styles.warning)}
                </span>
                <span style={{ marginBottom: '1em'}}>
                    {getStatCard('Reallocations', !loadedData ? 0 : loadedData.ridesAmendmentsData.numberOfReallocations, styles.success)}
                </span>
            </Stack>
            <span className={styles.v_divider} />
            <Stack style={{ flexGrow: 1}}>
                <span style={{ padding: '0 0.5em'}}>
                    <span>Last 30 mins</span>
                </span>
                <section className={styles.rideStatsWrapper}>
                    {getStatCard('Driver late', !loadedData ? 0 : loadedData.upcomingRides.driverLate, styles.alert)}
                    {getStatCard('No driver assigned', !loadedData ? 0 : loadedData.upcomingRides.driverNotAssigned, styles.alert)}
                    {getStatCard('Wrong pick-up', !loadedData ? 0 : loadedData.upcomingRides.wrongPickupLocation, styles.alert)}
                    {getStatCard('Wrong drop-off', !loadedData ? 0 : loadedData.upcomingRides.wrongDropOffLocation, styles.alert)}
                    {getStatCard('Completed rides', !loadedData ? 0 : loadedData.upcomingRides.ridesCompleted, styles.success)}
                </section>
            </Stack>
        </div>
        <Group style={{ width: '100%', justifyContent: 'center', padding: '0 1em'}}>
            {filterStatus !== undefined && <Badge variant="filled" styles={{ root: {
                backgroundColor: getStatusColor(filterStatus)
            }}}>
                {filterStatus}
            </Badge>}
            {filterStatus !== undefined && <a href='#' className={styles.normal_link} onClick={() => setFilterStatus(undefined)}>Clear</a>}
            <Menu shadow="md" width={300}>
                <Menu.Target>
                    <Button color="gray" size='xs' radius='sm'>Filter by</Button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Label>Select statuses</Menu.Label>
                    {loadedData && (
                        getStatusesList(loadedData.booking).map(s =>
                            <Menu.Item key={s} onClick={handleFilterClick} data-status={s}>
                                <Text size='xs' weight={600} data-status={s}>{s}</Text>
                            </Menu.Item>
                        )
                    )}
                </Menu.Dropdown>
            </Menu>

        </Group>
        <Grid p='md'>
            <Grid.Col span={12}>
                <Table striped={loadedData !== undefined} highlightOnHover>
                    <thead>
                        <tr>
                        <th>Booking ID</th>
                        <th>Going from</th>
                        <th>To</th>
                        <th>Pick-up time</th>
                        <th>Status</th>
                        <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loadedData &&
                            showSkeleton()
                        }
                        {loadedData && !loadedData.booking ? (
                            <tr key="errmsg">
                                <td colSpan={12}>
                                    No data
                                </td>
                            </tr>
                        ) : loadedData && (
                            getRows(loadedData, filterStatus)
                        )}
                    </tbody>
                </Table>
            </Grid.Col>
        </Grid>
    </div>
  )
}

export default Home
