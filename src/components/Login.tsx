import {
    FormControl,
    FormLabel,
    Input,
    HStack,
    Stack,
    Button,
    Text,
    Center,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    Icon,
    Box,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useUserAuth } from '../context/UserAuthContext'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { db } from '../firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { FiLogIn, FiLogOut } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

type LoginProps = {
    label?: string
}

type Inputs = {
    phoneNumber: string
}

type OtpValue = {
    otpValue: number
}

const initialUserInfo = { name: '', role: '' }

export default function Login({ label }: LoginProps) {
    const [error, setError] = useState('')
    const [number, setNumber] = useState('+91')
    const [flag, setFlag] = useState(false)
    const [otp, setOtp] = useState('')
    const [userInfo, setUserInfo] = useState(initialUserInfo)
    const [result, setResult] = useState<any>('')
    const { setUpRecaptha, setUserDetails, logOut, user } = useUserAuth()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [requestingOtp, setRequestingOtp] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure({})

    function resetForm() {
        setNumber('+91')
        setFlag(false)
        setError('')
        onClose()
    }

    const collectionRef = collection(db, 'users')
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setRequestingOtp(true)
        try {
            setError('')
            const userQuery = query(collectionRef, where('phoneNumber', '==', number))
            const querySnapshot = await getDocs(userQuery)
            if (querySnapshot.size === 0) throw Error('Number Not Authorized')
            let userdetails = querySnapshot.docs[0]?.data()
            localStorage.setItem('frp-username', userdetails?.name)
            localStorage.setItem('frp-userrole', userdetails?.role)
            setUserInfo({ name: userdetails?.name, role: userdetails?.role })
            const response = await setUpRecaptha(number)
            setResult(response)
            setFlag(true)
        } catch (error: any) {
            setError(error.message)
            console.log(error.message)
            setUserInfo(initialUserInfo)
            setRequestingOtp(false)
        }
    }

    const {
        register: registerOtp,
        handleSubmit: handleSubmitOtp,
        formState: { errors: errorsOtp },
    } = useForm<OtpValue>()
    const onSubmitOTP: SubmitHandler<OtpValue> = async () => {
        if (!otp) return
        setRequestingOtp(false)

        try {
            await result.confirm(otp)
            userInfo?.name && setUserDetails({ name: userInfo.name, role: userInfo.role })
            resetForm()
            navigate('/search-files')
        } catch (error: any) {
            console.log(error)
            setError(error.message)
        }
    }
    // console.log(errors)

    useEffect(() => {
        let username = localStorage.getItem('frp-username')
        let role = localStorage.getItem('frp-userrole')

        if (username && role) {
            setUserInfo({ name: username, role: role })
        }
    }, [])

    function setPhoneNumber(num: string) {
        setError('')
        if (num.length <= 3) {
            setNumber('+91')
            return
        }
        setNumber(num)
    }

    const changeOtp = (value: any) => {
        setError('')
        setOtp(value)
    }

    return (
        <>
            <HStack>
                {!user && (
                    <Button
                        rounded={'md'}
                        bg={'primary.400'}
                        color={'white'}
                        _hover={{
                            bg: 'accent.400',
                        }}
                        onClick={onOpen}
                        p={{ base: '12px 16px', md: '12px 18px' }}
                    >
                        <Icon as={FiLogIn} mr={'8px'} /> {label}
                    </Button>
                )}
                {user && (
                    <>
                        <Box textAlign={'right'}>
                            <Text fontSize={'lg'} textColor={'primary.400'}>{`${userInfo?.name}`}</Text>
                            <Text>{`${userInfo?.role}`}</Text>
                        </Box>
                        <Button
                            rounded={'md'}
                            bg={'primary.400'}
                            color={'white'}
                            _hover={{
                                bg: 'accent.400',
                            }}
                            onClick={logOut}
                            p={{ base: '12px 16px', md: '12px 18px' }}
                        >
                            <Icon as={FiLogOut} mr={'8px'} />
                            {t('logout')}
                        </Button>
                    </>
                )}
            </HStack>
            <Modal isOpen={isOpen} onClose={resetForm} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{flag ? t('enter_otp') : t('login')}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody mb={4}>
                        {!flag && (
                            <Stack>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <FormControl id="phonenumber" isRequired>
                                        <FormLabel>{t('ph_number')}</FormLabel>
                                        <Input
                                            type="tel"
                                            placeholder=""
                                            {...register('phoneNumber', {
                                                required: true,
                                                pattern: /(\+91)(\d{10})/gm,
                                            })}
                                            value={number}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </FormControl>
                                    {errors.phoneNumber && (
                                        <Text size={'sm'} color={'blue'}>
                                            {t('ph_error')}
                                        </Text>
                                    )}
                                    {error && (
                                        <Text size={'sm'} color={'red'}>
                                            {error}
                                        </Text>
                                    )}
                                    <Center>
                                        <div id="recaptcha-container"></div>
                                    </Center>
                                    <Center>
                                        {!requestingOtp && (
                                            <Button
                                                disabled={requestingOtp || !!error}
                                                loadingText="Submitting"
                                                size="lg"
                                                bg={'accent.400'}
                                                color={'white'}
                                                _hover={{
                                                    bg: 'primary.400',
                                                }}
                                                mt={6}
                                                type="submit"
                                            >
                                                {t('request_otp')}
                                            </Button>
                                        )}
                                    </Center>
                                </form>
                            </Stack>
                        )}

                        {flag && (
                            <Stack>
                                <Text fontSize={{ base: 'md', sm: 'md' }} textAlign={'center'} color={'gray.800'}>
                                    OTP has been sent to
                                    {` ******${number?.slice(-4)}`} successfully!
                                </Text>
                                <form onSubmit={handleSubmitOtp(onSubmitOTP)} name="otpNumber">
                                    <Center mt={4}>
                                        <Input
                                            size={'sm'}
                                            type="number"
                                            {...registerOtp('otpValue', {
                                                required: true,
                                            })}
                                            value={otp}
                                            onChange={(e) => changeOtp(e.target.value)}
                                        />
                                    </Center>

                                    {(errorsOtp.otpValue || error) && (
                                        <Text size={'sm'} color={'red'}>
                                            {t('otp_error')}
                                        </Text>
                                    )}

                                    <Center mt={6}>
                                        <Button
                                            bg={'accent.400'}
                                            color={'white'}
                                            _hover={{
                                                bg: 'primary.400',
                                            }}
                                            size={'lg'}
                                            type={'submit'}
                                        >
                                            {t('verify')}
                                        </Button>
                                    </Center>
                                </form>
                            </Stack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
