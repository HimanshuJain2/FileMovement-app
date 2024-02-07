import { Box, Container, Heading, HStack, Stack, Text, VStack } from '@chakra-ui/react'
import { logoImage } from '../assets/images'
import { useTranslation } from 'react-i18next'

export default function Footer() {
    const { t } = useTranslation()
    return (
        <Box bg={'white'} className={'footer'}  boxShadow={'0px -1px 1px gray'}>
            <Box>
                <Container
                    as={Stack}
                    maxW={'6xl'}
                    py={1}
                    direction={{ base: 'column', md: 'row' }}
                    justify={{ base: 'center', md: 'space-between' }}
                    align={{ base: 'center', md: 'center' }}
                >
                    <HStack>
                        <img src={logoImage} alt={'logo'} width={'80px'} />
                        <VStack justify={'flex-start'} alignItems={'flex-start'}>
                            <Heading fontSize={{ base: 'md', md: 'lg' }}>{t('kargov')}</Heading>
                            <Text fontSize={{ base: 'sm', md: 'lg' }}>{t('ifma')}</Text>
                        </VStack>
                    </HStack>
                    <Text noOfLines={1} fontSize={{ base: 'sm', md: 'lg' }}> © 2023 VelconTech.</Text>
                </Container>
            </Box>
        </Box>
    )
}
