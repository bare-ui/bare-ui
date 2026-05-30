'use client'

import { Carousel } from '@wire-ui/react'

const slides = [
  { label: 'Slide 1', bg: '#111111' },
  { label: 'Slide 2', bg: '#3f3f46' },
  { label: 'Slide 3', bg: '#71717a' },
  { label: 'Slide 4', bg: '#a1a1aa' },
]

const btnCls =
  'flex size-8 items-center justify-center rounded-full border border-black bg-white text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30'

export function CarouselPreview() {
  return (
    <div className="flex justify-center p-6">
      <Carousel.Root loop className="relative w-full max-w-md">
        <Carousel.Viewport
          tabIndex={0}
          className="overflow-hidden rounded-[20px] border border-black bg-white outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-black focus-visible:ring-2 focus-visible:ring-black"
        >
          <Carousel.Content>
            {slides.map((slide) => (
              <Carousel.Slide key={slide.label} className="w-full">
                <div
                  className="flex h-56 items-center justify-center text-2xl font-semibold text-white"
                  style={{ backgroundColor: slide.bg }}
                >
                  {slide.label}
                </div>
              </Carousel.Slide>
            ))}
          </Carousel.Content>
        </Carousel.Viewport>

        <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
          <Carousel.Previous className={btnCls}>‹</Carousel.Previous>
          <Carousel.Next className={btnCls}>›</Carousel.Next>
        </div>

        <div className="mt-3 flex justify-center gap-2">
          <Carousel.Indicators>
            {({ index, selected, scrollTo }) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={scrollTo}
                className={`size-2 rounded-full border border-black transition-colors ${selected ? 'bg-black' : 'bg-white'}`}
              />
            )}
          </Carousel.Indicators>
        </div>
      </Carousel.Root>
    </div>
  )
}
