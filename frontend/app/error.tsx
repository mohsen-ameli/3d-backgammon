"use client"

import Button from "@/components/ui/Button"
import Container from "@/components/ui/Container"
import Header from "@/components/ui/Header"

export default function error({ reset }: { reset: () => void }) {
  return (
    <Container>
      <Header href="/" title="Error" />

      <div className="flex size-full flex-col items-center justify-center">
        <div className="mb-4 text-center text-xl">Something went wrong :(</div>

        <Button onClick={reset} className="w-fit">
          Try Again
        </Button>
      </div>
    </Container>
  )
}
