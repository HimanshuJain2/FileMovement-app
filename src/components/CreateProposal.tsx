import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Textarea,
    Heading,
    HStack,
    Spinner,
    VStack,
    Flex,
    Spacer,
} from '@chakra-ui/react'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useUserAuth } from '../context/UserAuthContext'
import { useState } from 'react'
import { departmentList } from '../assets/departmentList'
import { subjectList } from '../assets/subjectList'
import { Select, CreatableSelect } from 'chakra-react-select'
import { useTranslation } from 'react-i18next'
import { forwardList } from '../assets/forwardList'
type Inputs = {
    department: { label: string; value: string }
    subject: { label: string; value: string }
    fileNo: string
    details: string
    forwardTo: { label: string; value: string }
}

export const groupedOptions = departmentList.map((dpt) => {
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

export const groupedForwardOptions = forwardList.map((sub) => {
    return {
        label: sub,
        value: sub,
    }
})

type CreateProposalProps = {
    refreshData: () => void
}
const CreateProposal = ({ refreshData }: CreateProposalProps) => {
    const collectionRef = collection(db, 'proposals')
    const { userDetails } = useUserAuth()
    const [filedAdded, setFileAdded] = useState(0)
    const [loading, setLoading] = useState(false)
    const { t } = useTranslation()
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setLoading(true)
        const date = new Date()
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const hour = date.getHours().toString().padStart(2, '0')
        const min = date.getMinutes().toString().padStart(2, '0')
        const sec = date.getSeconds().toString().padStart(4, '0')
        console.log()
        try {
            setTimeout(() => {
                addDoc(collectionRef, {
                    fileId: `DCM/${year}/${month}${day}${hour}${min}/${sec}`,
                    department: data.department.value,
                    forwardTo: data.forwardTo.value,
                    details: data.details,
                    subject: data.subject.value,
                    fileNo: data.fileNo,
                    status: data.forwardTo.value,
                    dispatchStatus: 'Pending Dispatch',
                    statusHistory: [
                        {
                            actor: userDetails.name || 'NA',
                            status: data.forwardTo.value,
                            dateTime: date.toLocaleString(),
                            forwardTo: data.forwardTo.value,
                            comment: '',
                        },
                    ],
                })
                console.log('done')
                setFileAdded(filedAdded + 1)
                reset()
                setLoading(false)
                refreshData()
            }, 1000)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    console.log('errors object', errors)

    return (
        <VStack
            w={['sm', 'md', '2xl', '4xl', '6xl']}
            minH={'60vh'}
            border={'1px solid #b2d8d8'}
            boxShadow={'5px 3px #b2d8d8'}
            borderRadius={'24px'}
            p={'25px'}
        >
            <Heading mb={'10px'}>{t('create_file')}</Heading>
            <Stack w={'full'}>
                {loading ? (
                    <Stack minH={'50vh'} alignItems={'center'} justify={'center'} alignSelf={'center'}>
                        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="primary.400" size="xl" />
                        <Heading fontSize={'18px'}>{t('creationInProgress')}</Heading>
                    </Stack>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={4} gap={4} w={'full'}>
                            <HStack>
                                <Flex wrap="wrap" justify="space-between" width={'100%'} gap="2">
                                    <Controller
                                        control={control}
                                        name="department"
                                        rules={{
                                            required: 'department selection is required',
                                        }}
                                        render={({
                                            field: { onChange, onBlur, value, name, ref },
                                            fieldState: { error },
                                        }) => (
                                            <FormControl
                                                flex={{
                                                    sm: '2',
                                                    md: '2',
                                                    lg: '1',
                                                }}
                                                id="department"
                                                isRequired
                                            >
                                                <FormLabel>{t('dept')}</FormLabel>
                                                <CreatableSelect
                                                    name={name}
                                                    ref={ref}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    options={groupedOptions}
                                                    placeholder={t('select')}
                                                    closeMenuOnSelect={true}
                                                />
                                                {errors.department && <p>{errors.department.message}</p>}
                                            </FormControl>
                                        )}
                                    />
                                    <Controller
                                        control={control}
                                        name="subject"
                                        rules={{
                                            required: 'main subject selection is required',
                                        }}
                                        render={({
                                            field: { onChange, onBlur, value, name, ref },
                                            fieldState: { error },
                                        }) => (
                                            <FormControl
                                                flex={{
                                                    sm: '2',
                                                    md: '2',
                                                    lg: '1',
                                                }}
                                                id="subject"
                                                isRequired
                                            >
                                                <FormLabel>{t('subject')}</FormLabel>
                                                <CreatableSelect
                                                    name={name}
                                                    ref={ref}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    options={groupedSubjectOptions}
                                                    placeholder={t('select')}
                                                    closeMenuOnSelect={true}
                                                />
                                                {errors.subject && <p>{errors.subject.message}</p>}
                                            </FormControl>
                                        )}
                                    />
                                </Flex>
                            </HStack>
                            <HStack>
                                <Flex wrap="wrap" justify="space-between" width={'100%'} gap="2">
                                    <FormControl
                                        flex={{
                                            sm: '2',
                                            md: '2',
                                            lg: '1',
                                        }}
                                        id="fileNo"
                                        isRequired
                                    >
                                        <FormLabel>{t('fileNo')}</FormLabel>
                                        <Input
                                            border={'2px solid #b2d8d8'}
                                            _focus={{
                                                borderColor: 'primary.400',
                                            }}
                                            placeholder=""
                                            _placeholder={{
                                                color: '#b2d8d8',
                                            }}
                                            type="text"
                                            {...register('fileNo', {
                                                required: true,
                                            })}
                                        />
                                        {errors.fileNo && <p>{errors.fileNo.message}</p>}
                                    </FormControl>

                                    <Controller
                                        control={control}
                                        name="forwardTo"
                                        rules={{
                                            required: 'fowarding officer selection is required',
                                        }}
                                        render={({
                                            field: { onChange, onBlur, value, name, ref },
                                            fieldState: { error },
                                        }) => (
                                            <FormControl
                                                flex={{
                                                    sm: '2',
                                                    md: '2',
                                                    lg: '1',
                                                }}
                                                id="forwardTo"
                                                isRequired
                                            >
                                                <FormLabel>{t('forwardTo')}</FormLabel>
                                                <Select
                                                    name="forwardTo"
                                                    ref={ref}
                                                    onChange={onChange}
                                                    onBlur={onBlur}
                                                    options={groupedForwardOptions}
                                                    placeholder={t('select')}
                                                    closeMenuOnSelect={true}
                                                />
                                                {errors.forwardTo && <p>{errors.forwardTo.message}</p>}
                                            </FormControl>
                                        )}
                                    />
                                </Flex>
                            </HStack>
                            <FormControl
                                flex={{
                                    sm: '2',
                                    md: '2',
                                    lg: '1',
                                }}
                                id="details"
                                isRequired
                            >
                                <FormLabel>{t('details')}</FormLabel>
                                <Textarea
                                    border={'2px solid #b2d8d8'}
                                    height={'150px'}
                                    _focus={{
                                        borderColor: 'primary.400',
                                    }}
                                    placeholder={t('enter_details')}
                                    _placeholder={{
                                        color: '#b2d8d8',
                                    }}
                                    {...register('details', {
                                        required: true,
                                    })}
                                />
                                {errors.details && <p>{errors.details.message}</p>}
                            </FormControl>
                        </Stack>
                        <HStack mt={'20px'} alignItems={'flex-end'} justifyContent={'end'}>
                            <Button mx={3} onClick={(e) => reset()} type="reset" variant={'ghost'}>
                                {t('cancel')}
                            </Button>
                            <Button
                                type={'submit'}
                                bgColor="primary.400"
                                color={'white'}
                                _hover={{
                                    color: 'black',
                                    bgColor: 'gray.100',
                                }}
                            >
                                {t('create_file')}
                            </Button>
                        </HStack>
                    </form>
                )}
            </Stack>
        </VStack>
    )
}
export default CreateProposal
