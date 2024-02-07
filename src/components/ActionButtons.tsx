import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { Button, HStack, Input, Select, Text } from '@chakra-ui/react'
import { RowData } from '@tanstack/react-table'

type Props<T extends RowData> = {
    hasNextPage: boolean
    hasPreviousPage: boolean
    nextPage: () => void
    pageCount: number
    pageIndex: number
    pageSize: number
    previousPage: () => void
    refreshData: () => void
    setPageIndex: (index: number) => void
    setPageSize: (size: number) => void
    totalRows: number
}

export function ActionButtons<T extends RowData>({
    hasNextPage,
    hasPreviousPage,
    nextPage,
    pageCount,
    pageIndex,
    pageSize,
    previousPage,
    refreshData,
    setPageIndex,
    setPageSize,
    totalRows,
}: Props<T>) {
    return (
        <HStack gap={{ base: 1, md: 3 }} fontSize={{ base: 'sm', md: 'md' }} flexWrap={'wrap'} justify={'center'}>
            <HStack>
                <Text fontSize={{ base: 'xs', md: 'md' }}>{totalRows} Rows</Text>
                <Button onClick={() => setPageIndex(0)} disabled={!hasPreviousPage}>
                    <ArrowLeftIcon boxSize={{ base: 2, md: 4 }} />
                </Button>
                <Button onClick={() => previousPage()} disabled={!hasPreviousPage}>
                    <ChevronLeftIcon boxSize={{ base: 3, md: 6 }} />
                </Button>
                <Button onClick={() => nextPage()} disabled={!hasNextPage}>
                    <ChevronRightIcon boxSize={{ base: 3, md: 6 }} />
                </Button>
                <Button onClick={() => setPageIndex(pageCount - 1)} disabled={!hasNextPage}>
                    <ArrowRightIcon boxSize={{ base: 2, md: 4 }} />
                </Button>

                <Text fontSize={{ base: 'xs', md: 'md' }}>
                    Page {pageIndex + 1} of {pageCount}
                </Text>
            </HStack>
            <HStack>
                <HStack m={'0'} p={'0'}>
                    <Text fontSize={{ base: 'xs', md: 'md' }}>| Go to page:</Text>
                    <Input
                        w={'50px'}
                        fontSize={{ base: 'xs', md: 'md' }}
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            setPageIndex(page)
                        }}
                    />
                </HStack>
                <Select
                    w={{ base: '100px', md: '120px' }}
                    fontSize={{ base: 'xs', md: 'md' }}
                    variant="filled"
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 50, 100].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </Select>
                <Button className="border p-1 rounded" onClick={refreshData} fontSize={{ base: 'xs', md: 'md' }}>
                    Refresh
                </Button>
            </HStack>
        </HStack>
    )
}

export default ActionButtons
