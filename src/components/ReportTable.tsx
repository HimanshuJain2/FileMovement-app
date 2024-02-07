import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    SortDirection,
    SortingState,
    getFilteredRowModel,
    Column,
    Table as TanTable,
    ColumnFiltersState,
} from '@tanstack/react-table'
import { InputHTMLAttributes, useEffect, useMemo, useState } from 'react'
import {
    Button,
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
} from '@chakra-ui/react'
import { Proposal } from './Proposal.types'
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import ActionButtons from './ActionButtons'
import { useTranslation } from 'react-i18next'
// import { usePapaParse } from 'react-papaparse'
import FileSaver from 'file-saver'
type ProposalTableProps = {
    data: Proposal[]
    columns: any[]
    refreshData: () => void
}

export default function ReportTable({ data, columns, refreshData }: ProposalTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [filtering, setFiltering] = useState('')
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const { t } = useTranslation()
    // const { jsonToCSV } = usePapaParse()

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters: columnFilters,
            sorting: sorting,
            globalFilter: filtering,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setFiltering,
        defaultColumn: {
            size: 80,
            minSize: 20,
            maxSize: 150,
        },
        initialState: {
            pagination: {
                pageSize: 20,
            },
        },
    })

    const generateReport = () => {
        console.log('Selected Rows')
        const items = table.getRowModel().rows.map((rw) => rw.original)
        const flatItems = items.map((itm: Proposal) => {
            return {
                'File No./Comp No.': itm.fileNo,
                Department: itm.department,
                Subject: itm.subject,
                Details: itm.details,
                'Application Status': itm.status,
                'Created By': itm.statusHistory[0].actor,
                'Created Time': itm.statusHistory[0].dateTime,
                'File History': itm.statusHistory
                    .map((sts, idx) => {
                        if (sts.comment.includes('Data Edit')) {
                            return `[ ${idx + 1} => ${sts.actor} edited File Details]`
                        } else {
                            return `[ ${idx + 1} => ${sts.actor} updated file to ${sts.status} with ${sts.comment}]`
                        }
                    })
                    .join(','),
            }
        })
        // console.log(flatItems)

        // const results = jsonToCSV(flatItems)

        const replacer = (key: any, value: any) => (value === null ? '' : value) // specify how you want to handle null values here
        const header = Object.keys(flatItems[0] || {})
        const results = [
            header.join(','), // header row first
            ...flatItems.map((row: any) =>
                header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')
            ),
        ].join('\r\n')
        const BOM = '\uFEFF'
        const csvData = new Blob([BOM + results], { type: 'text/csv;charset=utf-8;' })

        FileSaver.saveAs(csvData, 'FileListReport.csv')
        // console.log(results)
    }

    return (
        <VStack
        w={{
            base: 'sm',
            sm: 'xl',
            md: '5xl',
            lg: '6xl',
        }}
            minH={'70vh'}
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
            <Heading textAlign={'center'}>{t('gen_Report')}</Heading>
            <VStack 
            p={{
                base: '2px',
                sm: '4px',
                md: '10px',
                lg: '20px',
            }}>
                <Stack>
                    <Stack alignItems={'flex-end'}>
                        <Button w={'sm'} onClick={generateReport} bgColor={'primary.400'} color={'white'}>
                            {t('dwm_Report')}
                        </Button>
                    </Stack>
                    <TableContainer overflowX='auto' w={{
                            base: 'sm',
                            md: '2xl',
                            lg: '5xl',
                        }} bgColor={'gray.200'}  >
                        <Table borderRadius={'sm'}  >
                            <Thead >
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
                                                wordBreak={'break-word'}
                                                textColor={'white'}
                                                minW={{
                                                    base: '20px',
                                                    md: '30px',
                                                    
                                                }}
                                                px={'8px'}
                                                fontSize={{
                                                    base: 'sm',
                                                    md: 'sm',
                                                }}
                                            >
                                                {cell.isPlaceholder ? null : (
                                                    <>
                                                        <div>
                                                            {flexRender(
                                                                cell.column.columnDef.header,
                                                                cell.getContext()
                                                            )}
                                                            {
                                                                {
                                                                    asc: <ChevronUpIcon boxSize={4} />,
                                                                    desc: <ChevronDownIcon boxSize={4} />,
                                                                }[cell.column.getIsSorted() as SortDirection]
                                                            }
                                                        </div>
                                                        {cell.column.getCanFilter() ? (
                                                            <Filter column={cell.column} table={table} />
                                                        ) : null}
                                                    </>
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
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <Td
                                                key={cell.id}
                                                px={'8px'}
                                                py={'6px'}
                                                minW={{
                                                    base: '20px',
                                                    md: '30px',
                                                }}
                                                
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
        </VStack>
    )
}

function Filter({ column, table }: { column: Column<any, unknown>; table: TanTable<any> }) {
    const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id) || ''

    const columnFilterValue = column.getFilterValue()

    const sortedUniqueValues = useMemo(
        () => (typeof firstValue === 'number' ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort()),
        [column.getFacetedUniqueValues()]
    )

    return (
        <>
            <datalist id={column.id + 'list'}>
                {sortedUniqueValues?.slice(0, 5000).map((value: any) => <option value={value} key={value} />)}
            </datalist>
            <DebouncedInput
                type="text"
                value={(columnFilterValue ?? '') as string}
                onChange={(value) => column.setFilterValue(value)}
                placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
                list={column.id + 'list'}
            />
            <div className="h-1" />
        </>
    )
}

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <Input
            type={props.type}
            mt={'4px'}
            h={'25px'}
            fontSize={'12px'}
            color={'primary.400'}
            bgColor={'gray.100'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    )
}
