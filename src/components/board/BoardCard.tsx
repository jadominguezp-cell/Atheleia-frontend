import { Box, Text, Flex, Badge, Icon, Tooltip } from '@chakra-ui/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface CardData {
    id: string
    title: string
    description: string
    document_type: string
    priority: 'alta' | 'media' | 'baja'
    link?: string
    attachment_url?: string
    created_at: string
}

const PRIORITY_COLORS: Record<string, string> = {
    alta: 'red',
    media: 'yellow',
    baja: 'green',
}

const PRIORITY_LABELS: Record<string, string> = {
    alta: 'Alta',
    media: 'Media',
    baja: 'Baja',
}

interface BoardCardProps {
    card: CardData
    onClick: () => void
}

export function BoardCard({ card, onClick }: BoardCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: card.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Box
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            bg="gray.700"
            borderRadius="lg"
            p={3.5}
            cursor="grab"
            opacity={isDragging ? 0.5 : 1}
            _hover={{
                bg: 'gray.650',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                transform: 'translateY(-1px)',
            }}
            transition="all 0.15s ease"
            border="1px solid"
            borderColor={isDragging ? 'blue.400' : 'gray.600'}
            onClick={onClick}
            role="group"
        >
            {/* Priority indicator */}
            <Box
                position="absolute"
                top={0}
                left="12px"
                right="12px"
                h="3px"
                borderRadius="0 0 4px 4px"
                bg={`${PRIORITY_COLORS[card.priority]}.400`}
            />

            <Text color="white" fontSize="sm" fontWeight="500" mb={2} lineHeight="1.4">
                {card.title}
            </Text>

            {card.description && (
                <Text color="gray.400" fontSize="xs" mb={2} noOfLines={2} lineHeight="1.5">
                    {card.description}
                </Text>
            )}

            <Flex align="center" justify="space-between" mt={1}>
                <Flex gap={2} align="center">
                    {card.document_type && (
                        <Badge
                            bg="gray.600"
                            color="gray.300"
                            fontSize="10px"
                            px={2}
                            py={0.5}
                            borderRadius="md"
                            fontWeight="500"
                        >
                            {card.document_type}
                        </Badge>
                    )}
                    <Badge
                        colorScheme={PRIORITY_COLORS[card.priority]}
                        fontSize="10px"
                        px={2}
                        py={0.5}
                        borderRadius="md"
                        variant="subtle"
                    >
                        {PRIORITY_LABELS[card.priority]}
                    </Badge>

                    {card.link && (
                        <Tooltip label="Tiene enlace">
                            <Icon viewBox="0 0 24 24" w={3} h={3} color="blue.400">
                                <path fill="currentColor" d="M10.59 13.41c.41.39 1.04.39 1.41 0l2.59-2.59c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-2.59 2.59c-.39.4-.39 1.03 0 1.41zM12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4.2c-.66 0-1.2-.54-1.2-1.2s.54-1.2 1.2-1.2 1.2.54 1.2 1.2-.54 1.2-1.2 1.2z" />
                            </Icon>
                        </Tooltip>
                    )}
                    {card.attachment_url && (
                        <Tooltip label="Tiene archivo adjunto">
                            <Icon viewBox="0 0 24 24" w={3} h={3} color="green.400">
                                <path fill="currentColor" d="M16 6v8h-8V6h-2v8c0 1.1.9 2 2 2h8v2h-10v-2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h10V2h2v2h2v2h-2zm-2 0H8v8h6V6z" />
                            </Icon>
                        </Tooltip>
                    )}
                </Flex>
            </Flex>
        </Box>
    )
}
