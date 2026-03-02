import { expect, test, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AnimatedButton } from './AnimatedButton'

test('AnimatedButton calls onClick exactly once when clicked', () => {
    const handleClick = vi.fn()
    render(<AnimatedButton onClick={handleClick}>Click Me</AnimatedButton>)

    const button = screen.getByText('Click Me')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
})

test('AnimatedButton does not trigger onClick when isLoading is true', () => {
    const handleClick = vi.fn()
    render(<AnimatedButton onClick={handleClick} isLoading={true}>Click Me</AnimatedButton>)

    const button = screen.getByText('Click Me')
    fireEvent.click(button)

    // ChakraUI Button natively disables clicks if isLoading is true
    expect(handleClick).not.toHaveBeenCalled()
})

test('AnimatedButton does not trigger onClick when isDisabled is true', () => {
    const handleClick = vi.fn()
    render(<AnimatedButton onClick={handleClick} isDisabled={true}>Click Me</AnimatedButton>)

    const button = screen.getByText('Click Me')
    fireEvent.click(button)

    expect(handleClick).not.toHaveBeenCalled()
})
