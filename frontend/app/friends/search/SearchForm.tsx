"use client"

import Button, { ButtonLoading } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { BaseUser } from "@/types/User.type"
import React, { useRef, useState } from "react"
import AddButton from "./AddButton"

type SearchFormProps = {
  search: (typed: string) => Promise<BaseUser[]>
  sendFriendRequest: (id: number) => Promise<{
    message: string
    error: boolean
  }>
}

export default function SearchForm(props: SearchFormProps) {
  const { search, sendFriendRequest } = props
  const input = useRef<HTMLInputElement>(null!)

  const [friends, setFriends] = useState<BaseUser[]>([])
  const [clicked, setClicked] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setClicked(true)
    const data = await search(input.current.value)
    setFriends(data)
    setClicked(false)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4 flex w-full gap-x-2">
        <Input ref={input} className="flex-1" name="typed" type="text" placeholder="Name or Email" />
        <Button disabled={clicked} className="w-[80px]">
          {clicked ? <ButtonLoading /> : "Search"}
        </Button>
      </form>

      {input.current?.value !== "" &&
        (friends.length > 0 ? (
          friends.map(friend => (
            <div key={friend.id} className="mb-1 flex h-14 items-center justify-between rounded-lg bg-slate-200 px-2">
              <p>{friend.username}</p>
              <AddButton sendFriendRequest={sendFriendRequest} friend={friend} />
            </div>
          ))
        ) : (
          <p>No user found with the specified name or email. (Did you spell something wrong?)</p>
        ))}
    </div>
  )
}
