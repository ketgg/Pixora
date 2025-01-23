import React from "react"

import SignOutBtn from "@/components/auth/sign-out-btn"

type Props = {}

const Home = (props: Props) => {
  return (
    <div>
      Dashboard <SignOutBtn />
    </div>
  )
}

export default Home
