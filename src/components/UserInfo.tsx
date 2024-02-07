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

export default function UserInfo({ label }: LoginProps) {
  const [error, setError] = useState('')
  const [number, setNumber] = useState('+91')
  const [flag, setFlag] = useState(false)
  const [otp, setOtp] = useState('')
  const [userInfo, setUserInfo] = useState(initialUserInfo)
  const [result, setResult] = useState<any>('')
  const { setUpRecaptha, setUserDetails, logOut, user } = useUserAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure({})

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

              {user && (
                  <>
                      <Box textAlign={'center'}>
                          <Text fontSize={{base: 'xs', md: 'sm'}} textColor={'primary.400'}>{`${userInfo?.name}`}</Text>
                          <Text fontSize={{base: 'xs', md: 'sm'}} textAlign={'center'}>{`${userInfo?.role}`}</Text>
                      </Box>

                  </>
              )}
          </HStack>
      </>
  )
  }