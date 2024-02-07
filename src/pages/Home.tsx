import { Image, VStack } from '@chakra-ui/react'
import { welcome, welcomeKa } from '../assets/images'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

export default function SplitScreen() {
    const { t } = useTranslation()

    return (
        <VStack
            h={ '80vh' }
            direction={{ base: 'column', md: 'row' }}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <Image src={i18next.language === 'en' ? welcome : welcomeKa} width={{ base: 'md', md: '6xl' }}></Image>
        </VStack>
    )
}
