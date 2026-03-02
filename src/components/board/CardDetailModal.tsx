import { useState, useRef } from 'react'
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
    FormControl, FormLabel, Input, Textarea, Select, Button, VStack, Flex, Text, IconButton, Tooltip
} from '@chakra-ui/react'
import { AttachmentIcon, ExternalLinkIcon, CheckIcon } from '@chakra-ui/icons'

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

interface CardDetailModalProps {
    card: CardData
    isOpen: boolean
    onClose: () => void
    onUpdate: (cardId: string, data: Partial<CardData>) => void
    onDelete: (cardId: string) => void
}

export function CardDetailModal({ card, isOpen, onClose, onUpdate, onDelete }: CardDetailModalProps) {
    const [title, setTitle] = useState(card.title)
    const [description, setDescription] = useState(card.description || '')
    const [documentType, setDocumentType] = useState(card.document_type || '')
    const [priority, setPriority] = useState(card.priority)
    const [link, setLink] = useState(card.link || '')
    const [attachmentUrl, setAttachmentUrl] = useState(card.attachment_url || '')

    // For a mock file upload interaction
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleSave = () => {
        onUpdate(card.id, {
            title,
            description,
            document_type: documentType,
            priority,
            link,
            attachment_url: attachmentUrl
        })
        onClose()
    }

    const handleDelete = () => {
        onDelete(card.id)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
            <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
            <ModalContent bg="gray.800" borderColor="gray.700" border="1px solid" borderRadius="xl">
                <ModalHeader color="white" fontSize="lg" fontWeight="600" pb={1}>
                    Detalle de Documento
                </ModalHeader>
                <ModalCloseButton color="gray.400" />

                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel color="gray.300" fontSize="sm">Título</FormLabel>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                bg="gray.700" border="1px solid" borderColor="gray.600" color="white"
                                _focus={{ borderColor: 'blue.400' }}
                                borderRadius="lg"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel color="gray.300" fontSize="sm">Descripción</FormLabel>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                bg="gray.700" border="1px solid" borderColor="gray.600" color="white"
                                _focus={{ borderColor: 'blue.400' }}
                                borderRadius="lg"
                                rows={4}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel color="gray.300" fontSize="sm">Tipo de Documento</FormLabel>
                            <Input
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                placeholder="Ej: Certificado SUNARP, UIF, etc."
                                bg="gray.700" border="1px solid" borderColor="gray.600" color="white"
                                _placeholder={{ color: 'gray.500' }}
                                _focus={{ borderColor: 'blue.400' }}
                                borderRadius="lg"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel color="gray.300" fontSize="sm">Prioridad</FormLabel>
                            <Select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                                bg="gray.700" border="1px solid" borderColor="gray.600" color="white"
                                _focus={{ borderColor: 'blue.400' }}
                                borderRadius="lg"
                            >
                                <option value="baja" style={{ background: '#2D3748' }}>🟢 Baja</option>
                                <option value="media" style={{ background: '#2D3748' }}>🟡 Media</option>
                                <option value="alta" style={{ background: '#2D3748' }}>🔴 Alta</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel color="gray.300" fontSize="sm">Enlace Externo</FormLabel>
                            <Flex gap={2}>
                                <Input
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder="https://..."
                                    bg="gray.700" border="1px solid" borderColor="gray.600" color="white"
                                    _placeholder={{ color: 'gray.500' }}
                                    _focus={{ borderColor: 'blue.400' }}
                                    borderRadius="lg"
                                />
                                {link && (
                                    <Tooltip label="Abrir enlace" placement="top">
                                        <IconButton
                                            aria-label="Open Link"
                                            icon={<ExternalLinkIcon />}
                                            colorScheme="blue"
                                            variant="ghost"
                                            onClick={() => window.open(link, '_blank')}
                                        />
                                    </Tooltip>
                                )}
                            </Flex>
                        </FormControl>

                        <FormControl>
                            <FormLabel color="gray.300" fontSize="sm">Evidencia / Archivo</FormLabel>
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setIsUploading(true);
                                        // Mock upload delay
                                        setTimeout(() => {
                                            setAttachmentUrl('https://mock-storage.aletheia/files/' + e.target.files![0].name);
                                            setIsUploading(false);
                                        }, 1000);
                                    }
                                }}
                            />
                            <Flex gap={2} align="center">
                                <Button
                                    leftIcon={attachmentUrl ? <CheckIcon /> : <AttachmentIcon />}
                                    size="sm"
                                    colorScheme={attachmentUrl ? 'green' : 'gray'}
                                    variant="outline"
                                    isLoading={isUploading}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {attachmentUrl ? 'Archivo Adjunto' : 'Subir Archivo'}
                                </Button>
                                {attachmentUrl && (
                                    <Text fontSize="xs" color="gray.400" isTruncated maxW="200px">
                                        {attachmentUrl.split('/').pop()}
                                    </Text>
                                )}
                            </Flex>
                        </FormControl>

                        <Flex w="100%" justify="space-between" align="center" pt={2} mt={2} borderTop="1px solid" borderColor="gray.700">
                            <Text color="gray.500" fontSize="xs">
                                Creado: {new Date(card.created_at).toLocaleDateString('es-PE')}
                            </Text>
                        </Flex>
                    </VStack>
                </ModalBody>

                <ModalFooter gap={2}>
                    <Button size="sm" variant="ghost" color="red.400" _hover={{ bg: 'red.900' }} onClick={handleDelete}>
                        Eliminar
                    </Button>
                    <Button size="sm" variant="ghost" color="gray.400" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button size="sm" colorScheme="blue" onClick={handleSave}>
                        Guardar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
