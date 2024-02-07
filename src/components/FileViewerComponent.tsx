import { Box, Image } from '@chakra-ui/react'

type FileViewerComponentProps = {
    url: string
    format: string
}

const FileViewerComponent = ({ url, format }: FileViewerComponentProps) => {
    return (
        <Box>
            {format === 'pdf' ? (
                <iframe title={url} src={url} width={'300px'} height={'400px'} />
            ) : (
                <Image w={'300px'} h={'400px'} objectFit={'contain'} src={url} border={'1px solid gray'} />
            )}
        </Box>
    )
}
export default FileViewerComponent
