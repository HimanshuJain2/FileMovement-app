import { useEffect, useMemo, useState } from 'react'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import { createColumnHelper } from '@tanstack/react-table'
import { Proposal } from '../components/Proposal.types'
import ProposalTable from '../components/ProposalTable'
import { VStack, Text, Tooltip, Highlight, Tabs, Tab, TabList, TabPanel, TabPanels, Image, Flex, Grid, GridItem } from '@chakra-ui/react'
import { useUserAuth } from '../context/UserAuthContext'
import { useTranslation } from 'react-i18next'
import { CreateProposal, ReportTable } from '../components'
import { banner, bannerKa, home, homeKa } from '../assets/images'
import i18next from 'i18next'

const ViewProposals = () => {
    const collectionRef = collection(db, 'proposals')
    const [proposals, setProposals] = useState<Proposal[]>([] as Proposal[])
    const { userDetails } = useUserAuth()
    const { t } = useTranslation()

    console.log('Logged In Username: ', userDetails.name)

    const getProposals = async () => {
        await getDocs(collectionRef)
            .then((proposal: any) => {
                let proposalList: Proposal[] = proposal.docs.map((doc: any) => ({
                    ...doc.data(),
                    id: doc.id,
                }))
                let sortList = proposalList.sort((a, b) => {
                    let bIndex = b.statusHistory.length > 1 ? b.statusHistory.length - 1 : 0
                    let aIndex = a.statusHistory.length > 1 ? a.statusHistory.length - 1 : 0
                    let bTime = Date.parse(b.statusHistory[bIndex].dateTime)
                    let aTime = Date.parse(a.statusHistory[aIndex].dateTime)
                    return bTime - aTime
                })
                setProposals(sortList)
                console.log(sortList)
            })
            .catch((err) => {
                console.log('Error!')
            })
    }

    useEffect(() => {
        getProposals()
    }, [])

    const columnHelper = createColumnHelper<Proposal>()
    const data: Proposal[] = useMemo(() => proposals, [proposals])

    const columns = [
        columnHelper.accessor('fileNo', {
            header: t('fileNoShort'),
            enableSorting: true,
            cell: (info) => {
                let val = info.getValue()
                return (
                    <Tooltip label={val} aria-label="tooltip">
                        <Text
                            fontSize={'sm'}
                            whiteSpace={'nowrap'}
                            overflow={'hidden'}
                            textOverflow={'ellipsis'}
                            maxWidth={'120px'}
                        >
                            {val}
                        </Text>
                    </Tooltip>
                )
            },
        }),

        columnHelper.accessor('department', {
            header: t('depart'),
            cell: (info) => {
                let val = info.getValue()
                const abbr = (val as string).split(' - ')
                return (
                    <Tooltip label={abbr[1] || abbr[0]} aria-label="tooltip">
                        <Text>{abbr[0] || ''}</Text>
                    </Tooltip>
                )
            },
        }),
        columnHelper.accessor('subject', {
            header: () => t('subject'),
            cell: (info) => {
                let val = info.getValue()
                return (
                    <Tooltip label={val} aria-label="tooltip">
                        <Text
                            fontSize={'sm'}
                            whiteSpace={'nowrap'}
                            overflow={'hidden'}
                            textOverflow={'ellipsis'}
                            maxWidth={'120px'}
                        >
                            {val}
                        </Text>
                    </Tooltip>
                )
            },
        }),
        columnHelper.accessor('details', {
            header: () => t('details'),
            cell: (info) => {
                let val = info.getValue()
                return (
                    <Text
                        fontSize={'sm'}
                        whiteSpace={'nowrap'}
                        overflow={'hidden'}
                        textOverflow={'ellipsis'}
                        maxWidth={'120px'}
                    >
                        {val}
                    </Text>
                )
            },
        }),
        columnHelper.accessor('status', {
            header: t('status'),
            cell: (info) => {
                let status = info.getValue() || ''
                let color
                switch (status) {
                    case `OSD to Hon'ble DCM`:
                        color = 'white'
                        break
                    case `Secretary to Hon'ble DCM`:
                        color = 'gray.50'
                        break
                    case `Private Secretary to Hon'ble DCM`:
                        color = 'gray.300'
                        break
                    case `Addl Private Secretary to Hon'ble DCM`:
                        color = 'gray.400'
                        break
                    case `Home Office to Hon'ble DCM`:
                        color = 'gray.500'
                        break
                    case `Dispatched/Disposed`:
                        color = 'green.300'
                        break
                    default:
                        color = 'blue.50'
                        break
                }
                return (
                    <Text fontSize={'sm'}>
                        <Highlight
                            query={status || 'DRAFT'}
                            styles={{
                                px: '2',
                                py: '1',
                                rounded: 'md',
                                bg: color,
                            }}
                        >
                            {status}
                        </Highlight>
                    </Text>
                )
            },
        }),
        columnHelper.accessor('dispatchStatus', {
            header: t('dispatch'),
            enableSorting: true,
            cell: (info) => {
                let status = info.getValue() || ''
                if (status === 'Dispatched/Disposed') {
                    return (
                        <Tooltip label={'Dispatched'} aria-label="tooltip">
                            <Text>✅</Text>
                        </Tooltip>
                    )
                } else {
                    return (
                        <Tooltip label={'Pending Dispatch'} aria-label="tooltip">
                            <Text>🕒</Text>
                        </Tooltip>
                    )
                }
            },
        }),
        columnHelper.accessor('remarks', {
            header: t('remarks'),
            enableSorting: true,
            cell: (info) => {
                let val = info.getValue()
                return (
                    <Tooltip label={val} aria-label="tooltip">
                        <Text
                            fontSize={'sm'}
                            whiteSpace={'nowrap'}
                            overflow={'hidden'}
                            textOverflow={'ellipsis'}
                            maxWidth={'50px'}
                        >
                            {val}
                        </Text>
                    </Tooltip>
                )
            },
        }),
    ]
    return (
        <VStack minH={'80vh'} pt={'40px'}>
            <Image src={i18next.language === 'en' ? banner : bannerKa} width={'100%'} margin={{base:'50px',md:'10px'}} />
            <Tabs size={{base:'sm',sm:'lg',}} variant="soft-rounded" defaultIndex={0} align="center" marginY={{base:'0px',sm:'5px'}}  isFitted>
                <TabList mb="2em" >
                <Flex flexDirection={{base:'column',md:'row'}} gap={{base:'6',sm:'3'}} >
                    <Flex flexDirection={'row'} gap={{base:'6',sm:'3'}}>
                    <Tab
                        whiteSpace={'nowrap'}
                        border={'1px solid #b2d8d8'}
                        _selected={{
                            boxShadow: '5px 3px #b2d8d8',
                        }}
                        me={'12px'}
                    >
                        {t('home')}
                    </Tab>
                    <Tab
                        whiteSpace={'nowrap'}
                        border={'1px solid #b2d8d8'}
                        _selected={{
                            boxShadow: '5px 3px #b2d8d8',
                        }}
                        me={'12px'}
                    >
                        {t('create_file')}
                    </Tab>
                    </Flex>
                    <Flex flexDirection={'row'} gap={{base:'6',sm:'3'}} mb={{base:'5px',md:'0px'}}>
                    <Tab
                        whiteSpace={'nowrap'}
                        border={'1px solid #b2d8d8'}
                        _selected={{
                            boxShadow: '5px 3px #b2d8d8',
                        }}
                        me={'12px'}
                    >
                        {t('search_file')}
                    </Tab>
                    <Tab
                        whiteSpace={'nowrap'}
                        border={'1px solid #b2d8d8'}
                        _selected={{
                            boxShadow: '5px 3px #b2d8d8',
                        }}
                        me={'12px'}
                    >
                        {t('reports')}
                    </Tab>
                    </Flex>
                    </Flex>
                </TabList>
                <TabPanels >
                    <TabPanel p={'0'}>
                        <Image
                            src={i18next.language === 'en' ? home : homeKa}
                            width={{ base: 'xl', md: '6xl' }}
                            border={'1px solid #b2d8d8'}
                            boxShadow={'5px 3px #b2d8d8'}
                            borderRadius={'24px'}
                        />
                    </TabPanel>
                    <TabPanel p={'0'} >
                        <CreateProposal refreshData={getProposals}></CreateProposal>
                    </TabPanel>
                    <TabPanel p={'0'}>
                        <ProposalTable data={data} columns={columns} refreshData={getProposals} />
                    </TabPanel>
                    <TabPanel p={'0'}>
                        <ReportTable data={data} columns={columns} refreshData={getProposals} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </VStack>
    )
}
export default ViewProposals
