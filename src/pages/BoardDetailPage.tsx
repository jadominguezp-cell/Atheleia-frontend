import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Text, Flex, Input, Spinner, useToast, useDisclosure, Button } from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import {
    DndContext,
    DragOverlay,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragEndEvent,
    type DragOverEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { BoardColumn } from '../components/board/BoardColumn'
import { CardDetailModal } from '../components/board/CardDetailModal'
import { api } from '../lib/api'

interface CardData {
    id: string
    column_id?: string
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

interface BoardData {
    id: string
    title: string
    user_id: string
    columns: ColumnData[]
}

export function BoardDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [board, setBoard] = useState<BoardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [editingTitle, setEditingTitle] = useState(false)
    const [titleValue, setTitleValue] = useState('')
    const [activeCard, setActiveCard] = useState<CardData | null>(null)
    const [selectedCard, setSelectedCard] = useState<CardData | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    )

    const loadBoard = useCallback(async () => {
        if (!id) return
        try {
            const data = await api.boards.get(id)
            setBoard(data)
            setTitleValue(data.title)
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, status: 'error', duration: 3000 })
        } finally {
            setLoading(false)
        }
    }, [id, toast])

    useEffect(() => { loadBoard() }, [loadBoard])

    // ─── Title editing ───
    const handleTitleSave = async () => {
        if (!board || !titleValue.trim() || titleValue === board.title) {
            setEditingTitle(false)
            return
        }
        try {
            await api.boards.update(board.id, titleValue.trim())
            setBoard((prev) => prev ? { ...prev, title: titleValue.trim() } : prev)
        } catch {
            setTitleValue(board.title)
        }
        setEditingTitle(false)
    }

    // ─── Add card ───
    const handleAddCard = async (columnId: string, title: string) => {
        if (!board) return
        try {
            const card = await api.cards.create(board.id, columnId, title)
            setBoard((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    columns: prev.columns.map((col) =>
                        col.id === columnId ? { ...col, cards: [...col.cards, card] } : col
                    ),
                }
            })
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, status: 'error', duration: 3000 })
        }
    }

    // ─── Update card ───
    const handleUpdateCard = async (cardId: string, data: any) => {
        try {
            const updated = await api.cards.update(cardId, data)
            setBoard((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    columns: prev.columns.map((col) => ({
                        ...col,
                        cards: col.cards.map((c) => (c.id === cardId ? { ...c, ...updated } : c)),
                    })),
                }
            })
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, status: 'error', duration: 3000 })
        }
    }

    // ─── Delete card ───
    const handleDeleteCard = async (cardId: string) => {
        try {
            await api.cards.delete(cardId)
            setBoard((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    columns: prev.columns.map((col) => ({
                        ...col,
                        cards: col.cards.filter((c) => c.id !== cardId),
                    })),
                }
            })
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, status: 'error', duration: 3000 })
        }
    }

    // ─── Drag and Drop ───
    const findColumnByCardId = (cardId: string): ColumnData | undefined => {
        return board?.columns.find((col) => col.cards.some((c) => c.id === cardId))
    }

    const handleDragStart = (event: DragStartEvent) => {
        const card = board?.columns
            .flatMap((col) => col.cards)
            .find((c) => c.id === event.active.id)
        setActiveCard(card || null)
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over || !board) return

        const activeCol = findColumnByCardId(active.id as string)
        // Over can be a column or a card
        const overCol = board.columns.find((col) => col.id === over.id) || findColumnByCardId(over.id as string)

        if (!activeCol || !overCol || activeCol.id === overCol.id) return

        setBoard((prev) => {
            if (!prev) return prev
            const activeCard = activeCol.cards.find((c) => c.id === active.id)
            if (!activeCard) return prev

            return {
                ...prev,
                columns: prev.columns.map((col) => {
                    if (col.id === activeCol.id) {
                        return { ...col, cards: col.cards.filter((c) => c.id !== active.id) }
                    }
                    if (col.id === overCol.id) {
                        const overIndex = col.cards.findIndex((c) => c.id === over.id)
                        const insertIndex = overIndex >= 0 ? overIndex : col.cards.length
                        const newCards = [...col.cards]
                        newCards.splice(insertIndex, 0, { ...activeCard, column_id: col.id })
                        return { ...col, cards: newCards }
                    }
                    return col
                }),
            }
        })
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        setActiveCard(null)
        if (!over || !board) return

        const overCol = board.columns.find((col) => col.id === over.id) || findColumnByCardId(over.id as string)
        if (!overCol) return

        const activeIndex = overCol.cards.findIndex((c) => c.id === active.id)
        const overIndex = overCol.cards.findIndex((c) => c.id === over.id)

        if (activeIndex !== overIndex && activeIndex >= 0 && overIndex >= 0) {
            setBoard((prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    columns: prev.columns.map((col) => {
                        if (col.id === overCol.id) {
                            return { ...col, cards: arrayMove(col.cards, activeIndex, overIndex) }
                        }
                        return col
                    }),
                }
            })
        }

        // Persist to backend
        const targetCol = board.columns.find((col) =>
            col.cards.some((c) => c.id === active.id)
        )
        if (targetCol) {
            const cardIndex = targetCol.cards.findIndex((c) => c.id === active.id)
            try {
                await api.cards.move(active.id as string, targetCol.id, cardIndex >= 0 ? cardIndex : 0)
            } catch {
                // Reload on error
                loadBoard()
            }
        }
    }

    if (loading) {
        return (
            <Flex h="100%" align="center" justify="center">
                <Spinner size="xl" color="blue.400" thickness="3px" />
            </Flex>
        )
    }

    if (!board) {
        return (
            <Flex h="100%" align="center" justify="center">
                <Text color="gray.500">Tablero no encontrado</Text>
            </Flex>
        )
    }

    return (
        <Box h="100%" display="flex" flexDirection="column">
            {/* Board header */}
            <Flex px={6} py={4} align="center" borderBottom="1px solid" borderColor="gray.800" gap={4}>
                <Button
                    size="sm"
                    variant="ghost"
                    color="gray.400"
                    leftIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    _hover={{ bg: 'gray.800', color: 'white' }}
                >
                    Mis Tableros
                </Button>
                {editingTitle ? (
                    <Input
                        value={titleValue}
                        onChange={(e) => setTitleValue(e.target.value)}
                        onBlur={handleTitleSave}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleTitleSave()
                            if (e.key === 'Escape') { setTitleValue(board.title); setEditingTitle(false) }
                        }}
                        fontSize="xl"
                        fontWeight="700"
                        bg="gray.800"
                        border="1px solid"
                        borderColor="blue.400"
                        color="white"
                        borderRadius="lg"
                        maxW="400px"
                        h="42px"
                        autoFocus
                    />
                ) : (
                    <Text
                        fontSize="xl"
                        fontWeight="700"
                        color="white"
                        cursor="pointer"
                        onClick={() => setEditingTitle(true)}
                        _hover={{ bg: 'gray.800', px: 3, borderRadius: 'lg' }}
                        transition="all 0.15s"
                        title="Click para editar"
                        fontFamily="'Inter', sans-serif"
                    >
                        {board.title}
                    </Text>
                )}
            </Flex>

            {/* Kanban board */}
            <Box flex={1} overflowX="auto" p={4}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <Flex gap={4} h="100%" align="flex-start">
                        {board.columns.map((column) => (
                            <BoardColumn
                                key={column.id}
                                column={column}
                                onAddCard={handleAddCard}
                                onCardClick={(card) => { setSelectedCard(card); onOpen() }}
                            />
                        ))}
                    </Flex>
                    <DragOverlay>
                        {activeCard && (
                            <Box bg="gray.700" borderRadius="lg" p={3.5} border="1px solid" borderColor="blue.400"
                                boxShadow="0 10px 40px rgba(0,0,0,0.5)" opacity={0.9} maxW="300px">
                                <Text color="white" fontSize="sm" fontWeight="500">{activeCard.title}</Text>
                            </Box>
                        )}
                    </DragOverlay>
                </DndContext>
            </Box>

            {/* Card detail modal */}
            {selectedCard && (
                <CardDetailModal
                    card={selectedCard}
                    isOpen={isOpen}
                    onClose={() => { onClose(); setSelectedCard(null) }}
                    onUpdate={handleUpdateCard}
                    onDelete={handleDeleteCard}
                />
            )}
        </Box>
    )
}
