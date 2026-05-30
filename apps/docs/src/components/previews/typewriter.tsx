'use client'

import { Typewriter } from '@wire-ui/react'

const blinkCss =
  '@keyframes wire-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } } .wire-cursor { animation: wire-blink 1s step-end infinite }'

export function TypewriterPreview() {
  return (
    <div className="flex justify-center p-6">
      <style>{blinkCss}</style>
      <div className="w-full max-w-md rounded-[20px] border border-black bg-white p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-black bg-black text-xs font-bold text-white">
            AI
          </div>
          <div className="flex-1">
            <p className="mb-1 text-xs font-medium text-[#6b7280]">Assistant</p>
            <p className="text-sm leading-relaxed text-black">
              <Typewriter.Root
                text="The quick brown fox jumps over the lazy dog, one character at a time."
                speed={45}
                loop
                loopDelay={1500}
              >
                <Typewriter.Text />
                <Typewriter.Cursor
                  keepMounted
                  className="wire-cursor ml-0.5 inline-block w-[1ch] text-black"
                >
                  ▋
                </Typewriter.Cursor>
              </Typewriter.Root>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
