import { logoImage } from '../assets/images'
import {
    Box,
    Flex,
    Text,
    IconButton,
    Stack,
    Collapse,
    Icon,
    Link,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
    VStack,
    Heading,
    Button,
    HStack,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import Login from './Login'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'
import { useEffect, useState } from 'react'
import UserInfo from './UserInfo'
import LogButton from './Logbutton'

export default function Header() {
    const { isOpen, onToggle } = useDisclosure()
    const { t } = useTranslation()

    const toggleLanguage = () => {
        const lang = localStorage.getItem('frp-lang') || 'en'
        console.log(localStorage.getItem('frp-lang'))
        const newLang = lang === 'en' ? 'ka' : 'en'
        localStorage.setItem('frp-lang', newLang)
        i18n.changeLanguage(newLang)
    }

    return (
        <Box minH={'10vh'} className={'sticky'} w={'100%'}>
            <Flex
                boxShadow={'0px 1px 1px gray'}
                bgColor={'gray.50'}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                align={'center'}
            >
                <Flex
                    flex={{ base: 2 }}
                    justify={{ base: 'flex-start', md: 'start' }}
                    alignItems={'center'}
                    width={{ base: '30px', md: '80px' }}
                >
                    <Text
                        textAlign={useBreakpointValue({
                            base: 'center',
                            md: 'left',
                        })}
                        color={useColorModeValue('gray.800', 'white')}
                        display={{ base: 'inline-block' }}
                    >
                        <img src={logoImage} alt="subtle_web3" width={'80px'} />
                    </Text>
                    <VStack justify={'flex-start'} alignItems={'flex-start'} ml={'10px'}>
                        <Heading fontSize={{ base: 'md', md: 'lg' }} color={'black'}>
                            {t('kargov')}
                        </Heading>
                        <Text fontSize={{ base: 'sm', md: 'lg' }}>{t('ifma')}</Text>
                    </VStack>

                    {/* <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        <DesktopNav />
                    </Flex> */}
                </Flex>
                <Flex direction={'column'} justify={'center'} align={'center'}>
                    <Stack
                        flex={{ base: 1, md: 2 }}
                        justify={'flex-end'}
                        direction={'row'}
                        spacing={8}
                        align={'center'}
                    >
                        <Button onClick={toggleLanguage} display={{ base: 'none', md: 'inline-block' }}>
                            {' '}
                            ಕನ್ನಡ/English
                        </Button>
                        <Stack display={{ base: 'none', md: 'inline-block' }}>
                            <Login label={t('login')} />
                        </Stack>
                        <Stack display={{ base: 'inline-block', md: 'none' }}>
                            <UserInfo />
                        </Stack>
                    </Stack>
                    <Flex
                        flex={{ base: 1, md: 'auto' }}
                        ml={{ base: -2 }}
                        display={{ base: 'inline-block', md: 'none' }}
                    >
                        <HStack
                            display={{ base: 'none', md: 'inline-block' }}
                            
                            justifyContent={'center'}
                            textAlign={'center'}
                            fontSize={{base:'xs',md:'sm'}}
                        >
                            <UserInfo />
                        </HStack>
                        <IconButton
                            onClick={onToggle}
                            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                            variant={'ghost'}
                            aria-label={'Toggle Navigation'}
                        />
                    </Flex>
                </Flex>
            </Flex>
            <Collapse in={isOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </Box>
    )
}

const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200')
    const linkHoverColor = useColorModeValue('gray.800', 'white')
    const popoverContentBgColor = useColorModeValue('white', 'gray.800')

    return (
        <Stack direction={'row'} spacing={8} minH={{ base: '5vh', md: '7vh', lg: '5vh' }}>
            {NAV_ITEMS.map((navItem) => (
                <Box key={navItem.label} alignItems={'center'} justifyItems={'center'}>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                            <Link
                                href={navItem.href ?? '#'}
                                fontSize={'md'}
                                fontWeight={500}
                                color={linkColor}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}
                                lineHeight={'10'}
                            >
                                {navItem.label}
                            </Link>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow={'xl'}
                                bg={popoverContentBgColor}
                                p={4}
                                rounded={'xl'}
                                minW={'sm'}
                            >
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav key={child.label} {...child} />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    )
}

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
    return (
        <Link
            href={href}
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            _hover={{ bg: useColorModeValue('brand.50', 'gray.900') }}
        >
            <Stack direction={'row'} align={'center'} justify={'space-around'}>
                <Box>
                    <Text transition={'all .3s ease'} _groupHover={{ color: 'brand.400' }} fontWeight={500}>
                        {label}
                    </Text>
                    <Text fontSize={'sm'}>{subLabel}</Text>
                </Box>
                <Flex
                    transition={'all .3s ease'}
                    transform={'translateX(-10px)'}
                    opacity={0}
                    _groupHover={{
                        opacity: '100%',
                        transform: 'translateX(0)',
                    }}
                    justify={'flex-end'}
                    align={'center'}
                    flex={1}
                >
                    <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
                </Flex>
            </Stack>
        </Link>
    )
}

const MobileNav = () => {
    const { isOpen, onToggle } = useDisclosure()
    const { t } = useTranslation()

    const toggleLanguage = () => {
        const lang = localStorage.getItem('frp-lang') || 'en'
        console.log(localStorage.getItem('frp-lang'))
        const newLang = lang === 'en' ? 'ka' : 'en'
        localStorage.setItem('frp-lang', newLang)
        i18n.changeLanguage(newLang)
    }
    return (
        <Stack  p={4} display={{ md: 'none' }} justifyContent={'flexEnd'} bgColor={'gray.50'}>
            {NAV_ITEMS.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
            <Stack   display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'} >
                <Button onClick={toggleLanguage} textAlign={'center'} w='xs' fontSize='sm'>
                    {' '}
                    ಕನ್ನಡ/English
                </Button>
                <LogButton />
            </Stack>
        </Stack>
    )
}

const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure()

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Flex
                py={2}
                as={Link}
                href={href ?? '#'}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }}
            >
                <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>

            <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align={'start'}
                >
                    {children &&
                        children.map((child) => (
                            <Link key={child.label} py={2} href={child.href}>
                                {child.label}
                            </Link>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    )
}

interface NavItem {
    label: string
    subLabel?: string
    children?: Array<NavItem>
    href?: string
}

const NAV_ITEMS: Array<NavItem> = [
    // {
    //     label: 'Search Files',
    //     href: '/search-files',
    // },
    // {
    //     label: 'Reports',
    //     href: '/create-report',
    // },
]
