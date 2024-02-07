import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    SortDirection,
    SortingState,
    getFilteredRowModel,
} from '@tanstack/react-table'
import { useState } from 'react'
import {
    Button,
    HStack,
    Stack,
    VStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Input,
    Heading,
    InputGroup,
    InputLeftElement,
    Icon,
    Box,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    FormControl,
    FormLabel,
    Spinner,
    Radio,
    RadioGroup,
    AbsoluteCenter,
    Divider,
    Textarea,
    Flex,
} from '@chakra-ui/react'
import { Proposal, TStatus, statusType } from './Proposal.types'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import ActionButtons from './ActionButtons'
import { FiSearch, FiEdit, FiCheck, FiX } from 'react-icons/fi'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { collection, doc, updateDoc } from 'firebase/firestore'
import moment from 'moment'
import { db } from '../firebase'
import { useUserAuth } from '../context/UserAuthContext'
import { CreatableSelect } from 'chakra-react-select'
import { departmentList } from '../assets/departmentList'
import { subjectList } from '../assets/subjectList'
import { remarkList } from '../assets/remarkList'
import { useTranslation } from 'react-i18next'
import { forwardList } from '../assets/forwardList'

type Inputs = {
    department: { label: string; value: string }
    subject: { label: string; value: string }
    fileNo: string
    details: string
    comments: string
    forwardTo: { label: string; value: string }
    status: string
    dispatchStatus: 'Pending Dispatch' | 'Dispatched/Disposed'
    remarks: { label: string; value: string }
}

type ProposalType = {
    department?: string
    subject?: string
    fileNo?: string
    details?: string
    forwardTo?: string
    status?: string
    dispatchStatus?: 'Pending Dispatch' | 'Dispatched/Disposed'
    remarks?: string
    statusHistory?: statusType[]
}

type ProposalTableProps = {
    data: Proposal[]
    columns: any[]
    refreshData: () => void
}

const groupedOptions: Array<{ label: string; value: string }> = departmentList.map((dpt) => {
    return {
        label: dpt,
        value: dpt,
    }
})

export const groupedSubjectOptions = subjectList.map((sub) => {
    return {
        label: sub,
        value: sub,
    }
})

export const groupedRemarkOptions = remarkList.map((sub) => {
    return {
        label: sub,
        value: sub,
    }
})

export const groupedForwardOptions = forwardList.map((sub) => {
    return {
        label: sub,
        value: sub,
    }
})

export default function ProposalTable({ data, columns, refreshData }: ProposalTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [filtering, setFiltering] = useState('')
    const [editFile, setEditFile] = useState(false)
    const [proposalDetails, setProposalDetails] = useState<Proposal>()
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const { userDetails } = useUserAuth()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { t } = useTranslation()
    const collectionRef = collection(db, 'proposals')
    const { register, handleSubmit, control, getValues, reset } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (dat) => {
        setLoading(true)
        const date = new Date()

        let updateInfo: ProposalType = {
            fileNo: dat.fileNo,
            department: dat.department.value,
            subject: dat.subject.value,
            forwardTo: dat.forwardTo.value,
            status: dat.forwardTo.value,
            details: dat.details,
        }
        if (dat.dispatchStatus === 'Dispatched/Disposed') {
            updateInfo.dispatchStatus = 'Dispatched/Disposed'
            updateInfo.remarks = dat.remarks.value
            updateInfo.statusHistory = [
                ...proposalDetails!.statusHistory,
                {
                    actor: userDetails.name,
                    status: dat.forwardTo.value as TStatus,
                    dateTime: date.toLocaleString(),
                    forwardTo: dat.forwardTo.value,
                    comment: `Dispatched/Disposed to ${dat.remarks.value} [${dat.comments ? dat.comments : ''}]`,
                },
            ]
        } else {
            // const recentHistory = proposalDetails!.statusHistory!.at(-1)
            updateInfo.statusHistory = [
                ...proposalDetails!.statusHistory,
                {
                    actor: userDetails.name,
                    status: dat.forwardTo.value as TStatus,
                    dateTime: date.toLocaleString(),
                    forwardTo: dat.forwardTo.value,
                    comment: dat.comments,
                },
            ]
        }

        try {
            const fileInst = doc(collectionRef, proposalDetails?.id!)
            await updateDoc(fileInst, updateInfo)
            setTimeout(() => {
                setEditFile(false)
                setLoading(false)
                refreshData()
                resetAndClose()
                reset()
            }, 1000)
        } catch (error) {
            console.log(error)
            reset()
        }
        reset()
    }

    function cancelEdit() {
        reset()
        setEditFile(false)
    }

    function resetAndClose() {
        setEditFile(false)
        onClose()
    }

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting: sorting,
            globalFilter: filtering,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
        defaultColumn: {
            size: 80,
            minSize: 20,
            maxSize: 200,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    const handleRowClick = (row: any) => {
        // console.log(row)
        onClose()
        setProposalDetails({ ...row.original })
        onOpen()
    }

    // const toggleEdit = () => {
    //     setEditFile(!editFile)
    // }

    return (
        <VStack
            w={{
                base: 'sm',
                sm: 'xl',
                md: '5xl',
                lg: '6xl',
            }}
            minH={'60vh'}
            border={'1px solid #b2d8d8'}
            boxShadow={'5px 3px #b2d8d8'}
            borderRadius={'24px'}
            p={{
                base: '5px',
                sm: '5px',
                md: '20px',
                lg: '25px',
            }}
        >
            <Heading textAlign={'center'}>{t('list_file')}</Heading>
            <VStack
                // p={{
                //     base: '2px',
                //     sm: '4px',
                //     md: '10px',
                //     lg: '10px',
                // }}
            >
                <Stack>
                    <InputGroup mb={'10px'}>
                        <InputLeftElement pointerEvents="none">
                            <Icon as={FiSearch} boxSize={12} px={'10px'} color="#b2d8d8" />
                        </InputLeftElement>
                        <Input
                            type="text"
                            value={filtering}
                            onChange={(e) => setFiltering(e.target.value)}
                            placeholder={t('search_file')}
                            fontSize={'xl'}
                            _placeholder={{
                                color: '#b2d8d8',
                                fontSize: {
                                    base: 'sm',
                                    md: 'lg',
                                    lg: 'xl',
                                },
                            }}
                            border={'2px solid #b2d8d8'}
                            _focus={{
                                borderColor: 'primary.400',
                            }}
                        ></Input>
                    </InputGroup>

                    <TableContainer
                        w={{
                            base: 'sm',
                            md: '3xl',
                            lg: '5xl',
                        }}
                        bgColor={'gray.200'}
                    >
                        <Table
                            borderRadius={'sm'}
                            
                            
                        >
                            <Thead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <Tr
                                        key={headerGroup.id}
                                        bgColor={'primary.400'}
                                        color={'white'}
                                        fontSize={'md'}
                                        boxShadow={'0px 1px #b2d8d8'}
                                    >
                                        {headerGroup.headers.map((cell) => (
                                            <Th
                                                key={cell.id}
                                                onClick={cell.column.getToggleSortingHandler()}
                                                textAlign={'left'}
                                                textColor={'white'}
                                                minW={{
                                                    base: '20px',
                                                    md: '40px',
                                                }}
                                                px={'8px'}
                                                fontSize={{
                                                    base: 'sm',
                                                }}
                                            >
                                                {cell.isPlaceholder ? null : (
                                                    <div>
                                                        {flexRender(cell.column.columnDef.header, cell.getContext())}
                                                        {
                                                            {
                                                                asc: <ChevronUpIcon boxSize={4} />,
                                                                desc: <ChevronDownIcon boxSize={4} />,
                                                            }[cell.column.getIsSorted() as SortDirection]
                                                        }
                                                    </div>
                                                )}
                                            </Th>
                                        ))}
                                    </Tr>
                                ))}
                            </Thead>
                            <Tbody>
                                {table.getRowModel().rows.map((row) => (
                                    <Tr
                                        key={row.id}
                                        _hover={{
                                            bgColor: 'gray.100',
                                            cursor: 'pointer',
                                        }}
                                        p={{ base: '1rem', md: '1.5rem' }}
                                        onClick={(e) => handleRowClick(row)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <Td
                                                key={cell.id}
                                                px={'8px'}
                                                // py={ '6px'}
                                                // boxShadow={'2px 2px 2px #ccc'}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </Td>
                                        ))}
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Stack>
                <ActionButtons
                    hasNextPage={table.getCanNextPage()}
                    hasPreviousPage={table.getCanPreviousPage()}
                    nextPage={table.nextPage}
                    pageCount={table.getPageCount()}
                    pageIndex={table.getState().pagination.pageIndex}
                    pageSize={table.getState().pagination.pageSize}
                    previousPage={table.previousPage}
                    refreshData={refreshData}
                    setPageIndex={table.setPageIndex}
                    setPageSize={table.setPageSize}
                    totalRows={table.getPrePaginationRowModel().rows.length}
                />
            </VStack>
            <Modal
                closeOnOverlayClick={false}
                isOpen={isOpen}
                onClose={resetAndClose}
                motionPreset="slideInRight"
                isCentered
                size={{
                    base: 'sm',
                    
                    lg: '6xl',
                }} 
                
                id={proposalDetails?.id}
            >
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
                <ModalContent borderRadius={'md'}>
                    <ModalHeader boxShadow={'0px 2px 2px #006666'} mb={'10px'}>
                    <Flex flexDirection={'row'} alignItems={"center"} gap={{base:1,md:2}} flexWrap={'wrap'}>
                        <Text  textDecoration={'underline'} fontSize={{base:'14px',md:'20px'}} paddingRight={{base:'10px'}}>
                            {proposalDetails?.fileNo} -{' '}
                            </Text>
                        <Text
                            as={'span'}
                            textTransform={'uppercase'}
                            bgColor={
                                proposalDetails?.dispatchStatus === 'Dispatched/Disposed' ? 'green.400' : 'red.300'
                            }
                            p={'8px'}
                            fontSize={{base:'14px',md:'20px'}}
                            borderRadius={'md'}
                            color={'white'}
                            marginY={'10px'}
                        >
                            {proposalDetails?.dispatchStatus as string}
                        </Text>
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <ModalBody py={'20px'} h={'80vh'} overflowY={'scroll'}>
                            {!editFile && (
                                <HStack w={'full'} h={'auto'}  alignItems={'flex-start'} >
                                    <VStack
                                        w={'full'}
                                       
                                        justify={'space-between'}
                                        alignItems={'flex-start'}
                                        alignSelf={'flex-start'}
                                        px={'20px'}
                                    >
                                        <HStack w={'full'} h={'full'} alignItems={'flex-start'} mb={'5px'} flexDirection={{base:'column',md:'row'}}>
                                            <VStack justify={'flex-start'} alignItems={'top'}>
                                                {proposalDetails?.dispatchStatus === 'Dispatched/Disposed' && (
                                                    <Box></Box>
                                                )}
                                                <Box maxW={'400px'}>
                                                    <Text textDecoration={'underline'} fontSize={{base:'14px',md:'20px'}}>{t('subject')}</Text>
                                                    <Text fontSize={'16px'}>{proposalDetails?.subject}</Text>
                                                </Box>
                                                <Box maxWidth={'400px'}>
                                                    <Text textDecoration={'underline'} fontSize={{base:'14px',md:'20px'}}>{t('assignedTo')}</Text>
                                                    <Text fontSize={'16px'}>{proposalDetails?.forwardTo}</Text>
                                                </Box>
                                                <Box maxWidth={'400px'}>
                                                    <Text textDecoration={'underline'} fontSize={{base:'14px',md:'20px'}}>{t('dept')}</Text>
                                                    <Text fontSize={'16px'} maxWidth={'300px'}>
                                                        {proposalDetails?.department!.split(' - ')[1]}
                                                    </Text>
                                                </Box>
                                            </VStack>
                                            <VStack maxW={'600px'} h={{base:'auto',md:'250px'}}>
                                                <Box >
                                                    <Text textDecoration={'underline'} fontSize={{base:'14px',md:'20px'}} >{t('details')}</Text>
                                                    <Text fontSize={'16px'}  h={{base:"auto",md:'200px'}} overflowY={{scroll:'auto'}}>{proposalDetails?.details}</Text>
                                                </Box>
                                            </VStack>
                                        </HStack>
                                        <Box>
                                            <Text>File History</Text>
                                        </Box>
                                        <TableContainer
                                            w={'full'}
                                            bgColor={'gray.200'}
                                            overflowY={'scroll'}
                                            minH={'150px'}
                                            
                                        >
                                            <Table variant="simple">
                                                <Thead>
                                                    <Tr>
                                                        {/* <Th>{t('status')}</Th> */}
                                                        <Th>{t('sentBy')}</Th>
                                                        <Th>{t('sentTo')}</Th>
                                                        <Th>{t('date')}</Th>
                                                        <Th>{t('notes')}</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody overflowY={'scroll'}>
                                                    {proposalDetails?.statusHistory?.map((hist: statusType) => {
                                                        return (
                                                            <Tr key={hist.dateTime}>
                                                                {/* <Td>{hist.status}</Td> */}
                                                                <Td>{hist.actor}</Td>
                                                                <Td>{hist.forwardTo}</Td>
                                                                <Td>{moment(hist?.dateTime).format('DD/MM/YYYY hh:mm:ss A')}</Td>
                                                                <Td>{hist.comment}</Td>
                                                            </Tr>
                                                        )
                                                    })}
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </VStack>
                                </HStack>
                            )}
                            {editFile && (
                                <Stack spacing={4}>
                                    <HStack>
                                    <Flex wrap="wrap" justify="space-between" width={'100%'} gap="2">

                                        <Controller
                                            control={control}
                                            name="department"
                                            rules={{
                                                required: 'Select one department',
                                            }}
                                            defaultValue={{
                                                label: proposalDetails?.department || '-',
                                                value: proposalDetails?.department || '-',
                                            }}
                                            shouldUnregister={editFile}
                                            render={({
                                                field: { onChange, onBlur, value, name, ref },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl id="department" flex={{
                                                    sm: '3',
                                                    md: '1',
                                                    lg: '1',
                                                }} isRequired>
                                                    <FormLabel>{t('dept')}</FormLabel>
                                                    <CreatableSelect
                                                        defaultValue={{
                                                            label: proposalDetails?.department || '-',
                                                            value: proposalDetails?.department || '-',
                                                        }}
                                                        name={name}
                                                        ref={ref}
                                                        options={groupedOptions}
                                                        value={value}
                                                        onBlur={onBlur}
                                                        onChange={onChange}
                                                        closeMenuOnSelect={true}
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                        <Controller
                                            control={control}
                                            name="subject"
                                            rules={{
                                                required: 'Select one subject',
                                            }}
                                            defaultValue={{
                                                label: proposalDetails?.subject || '-',
                                                value: proposalDetails?.subject || '-',
                                            }}
                                            shouldUnregister={editFile}
                                            render={({
                                                field: { onChange, onBlur, value, name, ref },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl id="subject" flex={{
                                                    sm: '3',
                                                    md: '1',
                                                    lg: '1',
                                                }} isRequired>
                                                    <FormLabel>{t('subject')}</FormLabel>
                                                    <CreatableSelect
                                                        defaultValue={{
                                                            label: proposalDetails?.subject || '-',
                                                            value: proposalDetails?.subject || '-',
                                                        }}
                                                        name={name}
                                                        ref={ref}
                                                        options={groupedSubjectOptions}
                                                        value={value}
                                                        onBlur={onBlur}
                                                        onChange={onChange}
                                                        closeMenuOnSelect={true}
                                                    />
                                                </FormControl>
                                            )}
                                        />{' '}
                                        <FormControl id="fileNo" flex={{
                                                    sm: '3',
                                                    md: '1',
                                                    lg: '1',
                                                }} isRequired>
                                            <FormLabel> {t('fileNo')}</FormLabel>
                                            <Input
                                                placeholder=""
                                                _placeholder={{
                                                    color: '#b2d8d8',
                                                }}
                                                border={'2px solid #b2d8d8'}
                                                _focus={{
                                                    borderColor: 'primary.400',
                                                }}
                                                type="text"
                                                defaultValue={proposalDetails?.fileNo}
                                                {...register('fileNo', {
                                                    required: true,
                                                })}
                                            />
                                        </FormControl>
                                        </Flex>
                                    </HStack>
                                    <HStack>
                                        
                                        <FormControl id="details" isRequired>
                                            <FormLabel>{t('details')}</FormLabel>
                                            <Textarea
                                                placeholder=""
                                                _placeholder={{
                                                    color: '#b2d8d8',
                                                }}
                                                border={'2px solid #b2d8d8'}
                                                _focus={{
                                                    borderColor: 'primary.400',
                                                }}
                                                defaultValue={proposalDetails?.details}
                                                {...register('details', {
                                                    required: true,
                                                })}
                                            />
                                        </FormControl>
                                    </HStack>
                                    <Box position="relative" padding="4" borderColor={'primary.400'}>
                                        <Divider />
                                        <AbsoluteCenter bg="white" px="4">
                                            {t('forForward')}
                                        </AbsoluteCenter>
                                    </Box>
                                    <HStack>
                                    <Flex wrap="wrap" justify="space-between" width={'100%'} gap="2">

                                        <Controller
                                            control={control}
                                            name="forwardTo"
                                            rules={{
                                                required: 'Select one department',
                                            }}
                                            defaultValue={{
                                                label: proposalDetails?.forwardTo || '-',
                                                value: proposalDetails?.forwardTo || '-',
                                            }}
                                            shouldUnregister={editFile}
                                            render={({
                                                field: { onChange, onBlur, value, name, ref },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl id="forwardTo" flex={{
                                                    sm: '2',
                                                    md: '2',
                                                    lg: '1',
                                                }} isRequired>
                                                    <FormLabel>{t('forwardTo')}</FormLabel>
                                                    <CreatableSelect
                                                        defaultValue={{
                                                            label: proposalDetails?.forwardTo || '-',
                                                            value: proposalDetails?.forwardTo || '-',
                                                        }}
                                                        name={name}
                                                        ref={ref}
                                                        options={groupedForwardOptions}
                                                        value={value}
                                                        onBlur={onBlur}
                                                        onChange={onChange}
                                                        closeMenuOnSelect={true}
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                        <FormControl id="comment" flex={{
                                                    sm: '2',
                                                    md: '2',
                                                    lg: '1',
                                                }} isRequired>
                                            <FormLabel> {t('comment')}</FormLabel>
                                            <Input
                                                placeholder=""
                                                _placeholder={{
                                                    color: '#b2d8d8',
                                                }}
                                                border={'2px solid #b2d8d8'}
                                                _focus={{
                                                    borderColor: 'primary.400',
                                                }}
                                                type="text"
                                                {...register('comments', {
                                                    validate: () => {
                                                        let status = getValues('forwardTo')
                                                        let cmmt = getValues('comments')
                                                        // console.log('forwardTo Status', status.value)
                                                        if (status.value == proposalDetails?.forwardTo) {
                                                            return true
                                                        } else if (cmmt.length == 0) {
                                                            return false
                                                        } else {
                                                            return true
                                                        }
                                                    },
                                                })}
                                            />
                                        </FormControl>
                                        </Flex>
                                    </HStack>

                                    <Box position="relative" padding="4" borderColor={'primary.400'}>
                                        <Divider />
                                        <AbsoluteCenter bg="white" px="4">
                                            {t('for')}
                                        </AbsoluteCenter>
                                    </Box>
                                    <HStack>
                                    <Flex wrap="wrap" justify="space-between" width={'100%'} gap="2">

                                        <FormControl id="approve-reject" flex={{
                                                    sm: '2',
                                                    md: '2',
                                                    lg: '1',
                                                }}>
                                            <FormLabel>
                                                {t('Dispatch')}/{t('Dispose')}
                                            </FormLabel>
                                            <RadioGroup>
                                                <Stack spacing={5} direction="row">
                                                    <Radio
                                                        colorScheme="blue"
                                                        size="lg"
                                                        value="Dispatched/Disposed"
                                                        {...register('dispatchStatus')}
                                                    >
                                                        {t('dispatch_dispose')}
                                                    </Radio>
                                                </Stack>
                                            </RadioGroup>
                                        </FormControl>
                                        <Controller
                                            control={control}
                                            name="remarks"
                                            rules={{
                                                validate: () => {
                                                    let sts = getValues('dispatchStatus')
                                                    console.log('dispatch status', sts)
                                                    if (sts === 'Dispatched/Disposed') {
                                                        let rmk = !!getValues('remarks')
                                                        console.log(rmk)
                                                        return rmk
                                                    } else {
                                                        return true
                                                    }
                                                },
                                            }}
                                            render={({
                                                field: { onChange, onBlur, value, name, ref },
                                                fieldState: { error },
                                            }) => (
                                                <FormControl id="remarks" flex={{
                                                    sm: '2',
                                                    md: '2',
                                                    lg: '1',
                                                }}>
                                                    <FormLabel>{t('remarks')}</FormLabel>
                                                    <CreatableSelect
                                                        name={name}
                                                        ref={ref}
                                                        options={groupedRemarkOptions}
                                                        value={value}
                                                        onBlur={onBlur}
                                                        onChange={onChange}
                                                        closeMenuOnSelect={true}
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                        </Flex>
                                    </HStack>
                                </Stack>
                            )}
                        </ModalBody>

                        {`${userDetails.role} to Hon'ble DCM` === proposalDetails?.forwardTo &&
                        proposalDetails.dispatchStatus === 'Pending Dispatch' ? (
                            <ModalFooter  boxShadow={'0px -2px 2px #006666'} mt={'10px'} display={'flex'} flexDirection={'column-reverse'} justifyContent={'flex-end'}>
                                {loading && (
                                    <Spinner
                                        thickness="4px"
                                        speed="0.65s"
                                        emptyColor="gray.200"
                                        color="primary.400"
                                        size="xl"
                                    />
                                )}
                                {!editFile ? (
                                    <>
                                        <Button
                                            mr={3}
                                            type={'button'}
                                            colorScheme="gray"
                                            onClick={() => setEditFile(true)}
                                            isDisabled={loading}
                                        >
                                            <Icon as={FiEdit} mr={1}></Icon>
                                            {t('edit')}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                     <Flex direction={'row'} justifyContent={{base:'space-between',md:'flex-end'}} alignItems={'center'} gap={4}>
                                        <Button
                                            mr={3}
                                            onClick={cancelEdit}
                                            type="reset"
                                            variant={'ghost'}
                                            isDisabled={loading}
                                            border={'2px solid #b2d8d8'}
                                        >
                                            {t('cancel')}
                                        </Button>
                                        <Button
                                            type={'submit'}
                                            bgColor="primary.400"
                                            isDisabled={loading}
                                            color={'white'}
                                            _hover={{
                                                color: 'black',
                                                bgColor: 'gray.100',
                                            }}
                                        >
                                            {t('save')}
                                        </Button>
                                        </Flex>
                                    </>
                                )}
                            </ModalFooter>
                        ) : (
                            <ModalFooter></ModalFooter>
                        )}
                    </form>
                </ModalContent>
            </Modal>
        </VStack>
    )
}
