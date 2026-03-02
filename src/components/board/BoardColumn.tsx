import { useState } from 'react'
import { Box, Text, Flex, Button, Input, VStack } from '@chakra-ui/react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { BoardCard } from './BoardCard'

interface CardData {
    id: string
    title: string
    description: string
    document_type: string
    priority: 'alta' | 'media' | 'baja'
    created_at: string
}

interface ColumnData {
    id: string
    title: string
    color: string
    cards: CardData[]
}

interface BoardColumnProps {
    column: ColumnData
    onAddCard: (columnId: string, title: string) => void
    onCardClick: (card: CardData) => void
}

export function BoardColumn({ column, onAddCard, onCardClick }: BoardColumnProps) {
    const [adding, setAdding] = useState(false)
    const [newTitle, setNewTitle] = useState('')

    const { setNodeRef, isOver } = useDroppable({ id: column.id })

    const handleAdd = () => {
        if (!newTitle.trim()) return
        onAddCard(column.id, newTitle.trim())
        setNewTitle('')
        setAdding(false)
    }

    return (
        <Box
            minW="300px"
            maxW="300px"
            bg="gray.800"
            borderRadius="xl"
            display="flex"
            flexDirection="column"
            maxH="calc(100vh - 140px)"
            border="1px solid"
            borderColor={isOver ? 'blue.400' : 'gray.700'}
            transition="border-color 0.2s"
        >
            {/* Column header */}
            <Flex align="center" justify="space-between" px={4} py={3.5} borderBottom="1px solid" borderColor="gray.700">
                <Flex align="center" gap={2.5}>
                    <Box w="10px" h="10px" borderRadius="full" bg={column.color} boxShadow={`0 0 8px ${column.color}40`} />
                    <Text color="white" fontSize="sm" fontWeight="600">{column.title}</Text>
                    <Box bg="gray.700" borderRadius="full" px={2} py={0.5} minW="22px" textAlign="center">
                        <Text color="gray.400" fontSize="11px" fontWeight="600">{column.cards.length}</Text>
                    </Box>
                </Flex>
                <Button
                    size="xs" variant="ghost" color="gray.500"
                    _hover={{ color: 'white', bg: 'gray.700' }}
                    onClick={() => setAdding(!adding)}
                    fontSize="md" p={0} minW="auto"
                >
                    +
                </Button>
            </Flex>

            {/* Cards area */}
            <Box
                ref={setNodeRef}
                flex={1}
                overflowY="auto"
                px={3}
                py={2}
                css={{
                    '&::-webkit-scrollbar': { width: '3px' },
                    '&::-webkit-scrollbar-thumb': { background: '#4A5568', borderRadius: '4px' },
                }}
            >
                <SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                    <VStack spacing={2} align="stretch">
                        {column.cards.map((card) => (
                            <BoardCard key={card.id} card={card} onClick={() => onCardClick(card)} />
                        ))}
                    </VStack>
                </SortableContext>

                {/* Add card form */}
                {adding && (
                    <Box mt={2} bg="gray.700" borderRadius="lg" p={3}>
                        <Input
                            size="sm"
                            placeholder="Título del documento..."
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            bg="gray.600" border="none" color="white"
                            _placeholder={{ color: 'gray.400' }}
                            borderRadius="md" mb={2}
                            autoFocus
                        />
                        <Flex gap={2}>
                            <Button size="xs" colorScheme="blue" onClick={handleAdd} flex={1}>Agregar</Button>
                            <Button size="xs" variant="ghost" color="gray.400"
                                onClick={() => { setAdding(false); setNewTitle('') }}>
                                ✕
                            </Button>
                        </Flex>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
