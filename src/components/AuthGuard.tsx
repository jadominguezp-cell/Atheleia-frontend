import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../lib/auth-client'
import { Spinner, Flex } from '@chakra-ui/react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = useSession()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isPending && !session) {
            navigate('/login')
        }
    }, [session, isPending, navigate])

    if (isPending) {
        return (
            <Flex minH="100vh" align="center" justify="center" bg="gray.900">
                <Spinner size="xl" color="blue.400" thickness="3px" />
            </Flex>
        )
    }

    if (!session) return null

    return <>{children}</>
}
